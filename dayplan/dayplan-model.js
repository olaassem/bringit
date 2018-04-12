const mongoose = require('mongoose');



//Day plan
const dayplanSchema = new mongoose.Schema({ 
	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    categoryID: {type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    activityID: {type: mongoose.Schema.Types.ObjectId, ref: 'activity'},
    exerciseID: {type: mongoose.Schema.Types.ObjectId, ref: 'exercise'},
});



module.exports = mongoose.model( 'dayplan', dayplanSchema );

