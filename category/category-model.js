//To start, require mongoose.
const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	dayplanID: {type: mongoose.Schema.Types.ObjectId, ref: 'dayplan'},
	name : {type: String, required: true},
	img :  {type: String, required: true}
})



//Create model
module.exports = mongoose.model( 'category', categorySchema);



