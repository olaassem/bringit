const express = require('express');
//Require fitgoal model file
const fitgoalModel = require('../models/fitgoal-model');



//Creates router that routes middlewares and endpoints
const router = express.Router();




//ENDPOINTS


//Retrieve all fit goals
//NOTE: to use in Goals History Page.
router.get('/all', (req, res) => {
	fitgoalModel.find({}) 
		.then((goals) =>{
			res.status(200).json({
				message: "This is the list of all fit goals to-date.",
				data: goals
			})
		}) 
		.catch((error) => {
			res.status(500).json({
				message: "Error retrieving all fit goals to-date.",
				data: error
			})
		})
})


//HELP!!!!
//Delete specific fit goal by ID
router.delete('/:id', (req, res) => {
	fitgoalModel.findByIdAndRemove(req.params.id)
    	.then(() => {
      		res.status(200).json({ 
      			message: `Successfully deleted fit goal with ID ${req.params.id}.` 
      		})
    	})
    	.catch((error) => {
      		res.status(500).json({ 
      			message: `Error deleting fit goal with ID ${req.params.id}.`
      		})
    	})
});










//Create new fit goal.
//NOTE: to use in Home Page.
router.post('/new', ( req, res) => {
	//creating an object with the keys/values defined in bookSchema
	let newFitGoal = new fitgoalModel();
	newFitGoal.title = req.body.title;
	newFitGoal.description = req.body.description;
	//mongoose function to save object (goal) in the database
	newFitGoal.save()
		.then( goal =>{
			res.status(200).json({ 
				message: "New fit goal saved.",
				data: goal
			})
		})
		.catch(err => {
			res.status(500).json({ 
				message: "Error saving new fit goal."
			})
		})
})









//EXPORT THE ROUTER
//Must be the last code (use this order)
module.exports = router;
