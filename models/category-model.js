//To start, require mongoose.
const mongoose = require('mongoose');




const activitySchema = new mongoose.Schema({ 
	type: {type: String, required: true}, //TO DO: ().
	hour: Date,
	cardio: {
				distance: String,
				duration: Number
			},
	distance: {type: String, required: true},
	routine: {

			}
	duration: {type: Number, required: true},
	location: {type: String, required: true}, //may integrate google maps API
	inspiration: {type: String, required: false}, //link to blog/pic/video
	completed: {type: Boolean, required: true}
})










//Create model
module.exports = mongoose.model( 'category', categorySchema);



