const mongoose = require('mongoose');



//Exercise
const exerciseSchema = new mongoose.Schema({ 
	activityID: {type: String, required: false},//figure this out!		
	exercise: {type: String, required: false},
	sets: {type: Number, required: false},
	reps: {type: Number, required: false},
	weight: {type: String, required: false}
});



module.exports = mongoose.model( 'exercise', exerciseSchema );
