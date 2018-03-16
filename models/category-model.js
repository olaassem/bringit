//To start, require mongoose.
const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({ 
	name : {type: String, required: true},
	img :  {type: String, required: true}
})



//Create model
module.exports = mongoose.model( 'category', categorySchema);



