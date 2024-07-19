const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id},'jwt pracice token',{
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req,res) => {
    res.render('signup')
}

module.exports.signup_post = async (req,res) => {
    const {firstName, lastName, email, phone, password, conformpassword} = req.body;
    try{
        if(password === conformpassword){
            const password = await bcryptjs.hash(req.body.password, saltRounds);
            const newUser = await User.create({firstName, lastName, email, phone, password})
            console.log(newUser)
            const token = await createToken(newUser._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            res.cookie("theme", "light", {
              httpOnly: true,
              maxAge: maxAge * 1000,
            });
            res.redirect('/notes')
        }
        return res.status(400).json({msg: 'Password Mismatch'})    
    }catch(error){
        console.log(`Failed to create a account ${error}`)
    }
}

module.exports.login_get = (req,res) => {
    res.render('login')
}

module.exports.login_post = async (req,res) => {
    const {email, password} = req.body;
    try{
        const userData = await  User.findOne({email})
        if(userData) {
            const result = await bcryptjs.compare(password, userData.password);
            if(result){
                const token = await createToken(userData._id);
                res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000})
                res.redirect('/notes')
            }
            else{
                return res.status(400).json({ msg: 'Password mismatch'})
            }
        }
        else{
            return res.status(400).json({ msg: 'Email does not exist'})
        }
        
    } catch(error){
        console.log(`Unable to login ${error}`)
    }
}


module.exports.logout_get = (req,res) => {
    res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');

}

