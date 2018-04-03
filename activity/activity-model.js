const mongoose = require('mongoose');



//All activity types
const activitySchema = new mongoose.Schema({ 	
	categoryID:{type: mongoose.Schema.Types.ObjectId, ref: 'category'},
	name: {type: String, required: true},
	time: {type: String, required: true},
	duration: {type: Number, required: false},
	cardio: {
				distance: {type: Number, required: false},
				duration: {type: Number, required: false},
			},
	exercises: [{type: mongoose.Schema.Types.ObjectId, ref: 'exercises'}],
	location: {type: String, required: false}, //may integrate google maps API
	inspiration: {type: String, required: false}, //link to routine blog/pic/video
	completed: {type: Boolean, default: false}
});



module.exports = mongoose.model( 'activity', activitySchema );
