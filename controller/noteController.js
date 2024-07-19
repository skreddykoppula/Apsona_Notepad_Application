const Note = require('../models/Note');
const jwt = require("jsonwebtoken");
const User = require('../models/User');


const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, "jwt pracice token", (err, decodedToken) => {
            if (err) {
                reject(err);
            } else {
                resolve(decodedToken);
            }
        });
    });
}

module.exports.get_notes = async (req,res) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            const decodedToken = await verifyToken(token); 
            const userId = decodedToken.id;

            
            const Archieved = await Note.Archieved(userId);
            const notes = await Note.notes(userId);
            const Deleted = await Note.Deleted(userId); 
             const theme = req.cookies.theme || "light";
             
            if (req.accepts('html')) {
                res.render('notepad', {
                    Archieved,
                    notes,
                    Deleted,
                    theme,
                });
            } else {
                res.json({
                    Archieved,
                    notes,
                    Deleted,
                });
            } 
        }
    } catch (error) {
        console.log("Failed in retrieving todo", error);
        return res.status(422).json(error);
    }
}



module.exports.notes_create = async (req, res) => {
    const { title, content } = req.body;
    if (title.trim().length === 0) {
        return res.status(404).json({ msg: "Title can't be empty" });
    } else if (content.trim().length === 0) {
        return res.status(404).json({ msg: "Content can't be empty" });
    } else {
        try {
            const token = req.cookies.jwt;
            if (token) {
                const decodedToken = await verifyToken(token); 
                const userId = decodedToken.id;
                await Note.addNote({ title, content, userId }); 
                res.redirect('/notes')
            }
        } catch (error) {
            console.log("Failed in adding note", error);
            return res.status(422).json({ error: error.message });
        }
    }
}


module.exports.add_label = async (req, res) => {
    const { id } = req.params;
    const { label } = req.body;

    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await note.addLabel(label);
        return res.status(200).json(note);
    } catch (error) {
        console.error("Failed in updating note", error);
        return res.status(500).json({ message: 'Failed in updating note', error });
    }
}


module.exports.delete = async (req,res) => {
    const { id } = req.params;
    try{
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.deleteNote();
        return res.status(200).json(note);
    } catch (error) {
        console.error("Failed in updating note", error);
        return res.status(500).json({ message: 'Failed in updating note', error });
    }
}


module.exports.deleterestore = async (req,res) => {
    const { id } = req.params;
    try{
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.deleterestoreNote();
        return res.status(200).json(note);
    } catch (error) {
        console.error("Failed in updating note", error);
        return res.status(500).json({ message: 'Failed in updating note', error });
    }
}


module.exports.archieve = async (req,res) => {
    const { id } = req.params;
    try{
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.archieveNote();
        return res.status(200).json(note);
    } catch (error) {
        console.error("Failed in updating note", error);
        return res.status(500).json({ message: 'Failed in updating note', error });
    }
}

module.exports.archieverestore = async (req,res) => {
    const { id } = req.params;
    try{
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.archieverestoreNote();
        return res.status(200).json(note);
    } catch (error) {
        console.error("Failed in updating note", error);
        return res.status(500).json({ message: 'Failed in updating note', error });
    }
}



module.exports.search = async (req,res) => {
    const { query } = req.query;
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log(query)
    const decodedToken = await verifyToken(token);
    const userId = decodedToken.id;
    console.log(userId);
    try {
        console.log("Started...")
        const notes = await Note.find({
            userId: userId,
            label: { $regex: new RegExp(query, 'i') } 
        });
        console.log(notes)
        res.render('search', {query:query, data: notes }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

