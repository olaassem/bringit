const mongoose = require('mongoose');



//All user types
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});



module.exports = mongoose.model('user', userSchema);