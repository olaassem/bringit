const mongoose = require('mongoose');



//Exercise
const exerciseSchema = new mongoose.Schema({ 
    //activityID:{type: mongoose.Schema.Types.ObjectId, ref: 'activity'},	
	name: {type: String, required: false},
	sets: {type: String, required: false},
	reps: {type: String, required: false},
	weight: {type: String, required: false}
});



module.exports = mongoose.model( 'exercise', exerciseSchema );
