const mongoose = require('mongoose');



//Quote
const quoteSchema = new mongoose.Schema({ 
	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	quote: {type: String, required: true},
});



module.exports = mongoose.model( 'quote', quoteSchema);
