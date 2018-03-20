const mongoose = require('mongoose');



//All activity types
const activitySchema = new mongoose.Schema({ 		
	name: {type: String, required: true},
	time: {type: String, required: true},
	duration: {type: Number, required: false},
	cardio: {
				distance: {type: Number, required: false},
				duration: {type: Number, required: false},
			},
	routine: [{type: mongoose.Schema.Types.ObjectId, ref: 'exercise'}],//(Jon) Reference to 'exercise' and populate
	location: {type: String, required: false}, //may integrate google maps API
	inspiration: {type: String, required: false}, //link to routine blog/pic/video
	completed: {type: Boolean, required: true}
});



module.exports = mongoose.model( 'activity', activitySchema );
