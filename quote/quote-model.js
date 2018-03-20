const mongoose = require('mongoose');



//Quote
const quoteSchema = new mongoose.Schema({ 
	quote: {type: String, required: true},
});



module.exports = mongoose.model( 'quote', quoteSchema);
