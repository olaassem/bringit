const mongoose = require('mongoose');



const exerciseSchema = new mongoose.Schema({ 
	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	name: {type: String, required: false},
	sets: {type: String, required: false},
	reps: {type: String, required: false},
	weight: {type: String, required: false}
});



module.exports = mongoose.model( 'exercise', exerciseSchema );




