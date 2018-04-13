const mongoose = require('mongoose');



//All activity types
const activitySchema = new mongoose.Schema({
 	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	name: {type: String, required: true},
	time: {type: String, required: true},
	duration: {type: String, required: true},
	cardio: {
				distance: {type: String, required: false},
				duration: {type: String, required: false},
			},
	location: {type: String, required: false},
	inspiration: {type: String, required: false},
	completed: {type: Boolean, default: false}
});



module.exports = mongoose.model( 'activity', activitySchema );