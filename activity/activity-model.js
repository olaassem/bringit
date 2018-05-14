const mongoose = require('mongoose');


const activitySchema = new mongoose.Schema({
 	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	name: {type: String, required: true},
	time: {type: String, required: true},
	duration: {type: String, required: true},
	cardio: {
				distance: {type: String, required: false}
			},
	location: {type: String, required: false},
	inspiration: {type: String, required: false}
});


module.exports = mongoose.model( 'activity', activitySchema );