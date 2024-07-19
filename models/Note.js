const mongoose = require("mongoose");
const User = require('./User');
const { use } = require("../routes/authRoutes");

const NoteSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    label: [
      {
        type: String,
      },
    ],
    deleted: {
      type: Boolean,
    },
    Archieve: {
      type: Boolean,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

NoteSchema.methods = {

    async addLabel(label) {
        try {
            if (this.label.length >= 9) {
                throw new Error('Maximum number of labels (9) reached');
            }
            this.label.push(label.toLowerCase());
            await this.save();
            return this; 
        } catch (error) {
            console.error("Error in adding label:", error);
            throw error;
        }
    },

    async deleteNote() {
        try{
            const updatedNote = this.updateOne({deleted: true});
            return updatedNote;
        }catch (error) {
            console.error("Error in deleting note:", error);
            throw error;
        }
    },

    async deleterestoreNote() {
        try{
            const updatedNote = this.updateOne({deleted: false});
            return updatedNote;
        }catch (error) {
            console.error("Error in deleting note:", error);
            throw error;
        }
    },

    async archieveNote() {
        try{
            const updatedNote = this.updateOne({Archieve: true});
            return updatedNote;
        }catch (error) {
            console.error("Error in deleting note:", error);
            throw error;
        }
    },

    async archieverestoreNote() {
        try{
            const updatedNote = this.updateOne({Archieve: false});
            return updatedNote;
        }catch (error) {
            console.error("Error in deleting note:", error);
            throw error;
        }
    },
}



NoteSchema.statics = {
    async addNote({ title, content, userId }) {
      try {
        console.log("NoteSchema",userId)
        return await this.create({ title: title, content: content, label: [], deleted: false, Archieve: false, userId:userId});
      } catch (error) {
        console.log("Error in adding Note:", error);
      }
    },

    async Archieved(userId) {
        try {
            return await this.find({Archieve: true, userId});
          } catch (error) {
            console.log("Error in getting archieved:", error);
          }
    },



    async notes(userId) {
        try {
            return await this.find({deleted:false, Archieve: false, userId});
          } catch (error) {
            console.log("Error in getting notes:", error);
          }
    },

    async Deleted(userId) {
        try {
            return await this.find({deleted: true, userId});
          } catch (error) {
            console.log("Error in getting deleted:", error);
          }
    },
}

module.exports = mongoose.model("Notes", NoteSchema);
