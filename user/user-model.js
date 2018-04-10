const mongoose = require('mongoose');



//All user types
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});



module.exports = mongoose.model('user', userSchema);