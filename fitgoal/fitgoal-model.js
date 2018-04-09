//To start, require mongoose.
const mongoose = require('mongoose');



const fitgoalSchema = new mongoose.Schema({
	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}, //this is the user ID that WE will send
	createDate: {type: Date},  //default: Date.now},
	title : {type: String, required: true},
	description : {type: String, required: true},
	completed: {type: Boolean, default: false }
});



//Create model
module.exports = mongoose.model( 'fitgoal', fitgoalSchema);
