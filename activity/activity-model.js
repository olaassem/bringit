const mongoose = require('mongoose');



//All activity types
const activitySchema = new mongoose.Schema({
 	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	dayplanID: {type: mongoose.Schema.Types.ObjectId, ref: 'dayplan'},
	name: {type: String, required: true},
	time: {type: String, required: true},
	duration: {type: Number, required: false},
	cardio: {
				distance: {type: Number, required: false},
				duration: {type: Number, required: false},
			},
	// exercises: [{type: mongoose.Schema.Types.ObjectId, ref: 'exercises'}],
	location: {type: String, required: false},
	inspiration: {type: String, required: false},
	completed: {type: Boolean, default: false}
});



module.exports = mongoose.model( 'activity', activitySchema );