//To start, require mongoose.
const mongoose = require('mongoose');



const fitgoalSchema = new mongoose.Schema({
	//date: {type: Date, required: true}
	title : {type: String, required: true},
	description : {type: String, required: true}
});



//Create model
module.exports = mongoose.model( 'fitgoal', fitgoalSchema);
