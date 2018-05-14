const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique:true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    created: {type: Date, default: Date.now},
    currentQuote : {type: String}
});



module.exports = mongoose.model('user', userSchema);
