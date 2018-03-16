const express = require('express');
//Require fitgoal model file
const fitgoalModel = require('../models/fitgoal-model');



//Creates router that routes middlewares and endpoints
const router = express.Router();




/***   ENDPOINTS   ***/



//Create new fit goal.
//NOTE: to use in Home Page.
router.post('/new', ( req, res) => {
	//creating an object with the keys/values defined in bookSchema
	let newFitGoal = new fitgoalModel();
	newFitGoal.title = req.body.title;
	newFitGoal.description = req.body.description;
	//mongoose function to save object (goal) in the database
	newFitGoal.save()
	.then( (goal) =>{
		res.status(200).json({ 
			message: `New fit goal (${newFitGoal.title}) saved.`,
			data: goal
		})
	})
	.catch((error) => {
		res.status(500).json({ 
			message: `Error saving new fit goal (${newFitGoal.title}).`
		})
	})
})



//Get all fit goals
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



//Get fit goal by ID
router.get('/:id', (req, res) => {
	fitgoalModel.findById(req.params.id)
	.then((goal) => {
		res.status(200).json({
			message: `Successfully retrieved fit goal with ID ${req.params.id}.`,
			data: goal
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: `Error retrieving fit goal with ID ${req.params.id}.`,
			data: error
		})
	})
})



//Edit fit goal
router.put('/:id', (req, res) => {
	if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
		res.status(400).json({
			message: "Error. Request path id and request body id values must match."
    	});
  	}
  	const updated = {};
  	const updateableFields = ['title', 'description'];
  	updateableFields.forEach(field => {
    	if (field in req.body) {
      		updated[field] = req.body[field];
    	}
  	});
  	//$set : mongoose functionality for updating specific fields selected in the db
  	fitgoalModel.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
	.then((updatedGoal) => {
		res.status(200).json({
			message: "Fit goal updated successfully."
		})
	})	
	.catch((error) => {
		res.status(500).json({ 
			message: "Error updating fit goal."
		})	
	}) 	
});



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
  			message: `Error deleting fit goal with ID ${req.params.id}.`,
  			data: error
  		})
	})
});



//EXPORT THE ROUTER
//Must be the last code (use this order)
module.exports = router;
