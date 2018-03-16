const mongoose = require('mongoose');



//All activity types
const activitySchema = new mongoose.Schema({ 		
	type: {type: String, required: true},
	hour: {type: Date, required: true},
	duration: {type: Number, required: true},
	cardio: {
				distance: String,
				duration: Number
			},
	routine: {
				excercise: {type: String, required: false},
				sets: {type: Number, required: false},
				reps: {type: Number, required: false},
				weight: {type: Number, required: false}
			},
	location: {type: String, required: false}, //may integrate google maps API
	inspiration: {type: String, required: false}, //link to routine blog/pic/video
	completed: {type: Boolean, required: true}
});



module.exports = mongoose.model( 'activity', activitySchema );
