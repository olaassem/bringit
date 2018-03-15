const mongoose = require('mongoose');


//All activity types
const categorySchema = new mongoose.Schema({ 
	name : {type: String, required: true},
	img :  {type: String, required: true},
	//routine : {type: String, required: true}
});


module.exports = mongoose.model( 'activity', activitySchema);
