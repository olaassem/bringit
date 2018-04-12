const mongoose = require('mongoose');



//All user types
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique:true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    created: {type: Date, default: Date.now},
    currentQuote : {type: String}, 
    // dayplan: {type: mongoose.Schema.Types.ObjectId, ref: 'dayplan'}
});



module.exports = mongoose.model('user', userSchema);
