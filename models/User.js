const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email:{
        type: String,
        unique: true
    },
    phoneNumber:{
        type: Number,
    },
    password: {
        type: String,
    }
})

module.exports = mongoose.model("Users",userSchema);