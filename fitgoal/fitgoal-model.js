//To start, require mongoose.
const mongoose = require('mongoose');



const fitgoalSchema = new mongoose.Schema({
	createDate: {type: Date, default: Date.now}, //LOOK IT UP
	title : {type: String, required: true},
	description : {type: String, required: true}
});



//Create model
module.exports = mongoose.model( 'fitgoal', fitgoalSchema);
