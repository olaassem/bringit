const mongoose = require('mongoose');



const fitgoalSchema = new mongoose.Schema({
	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	createDate: {type: Date},
	title : {type: String, required: true},
	description : {type: String, required: true},
	completed: {type: Boolean, default: false }
});



module.exports = mongoose.model( 'fitgoal', fitgoalSchema);
