//To start, require mongoose.
const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	name : {type: String, required: true},
	img :  {type: String, required: true}
})


module.exports = mongoose.model( 'category', categorySchema);



