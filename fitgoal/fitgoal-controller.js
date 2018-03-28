const fitgoalModel = require('./fitgoal-model');



//Create new fit goal.
//NOTE: to use in Home Page.
exports.postNewFitGoal = ( req, res) => {
	//creating an object with the keys/values defined in bookSchema
	let newFitGoal = new fitgoalModel();
	newFitGoal.title = req.body.title;
	newFitGoal.createDate = req.body.createDate;
	newFitGoal.description = req.body.description;
	newFitGoal.completed = req.body.completed;
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
}



//Get all fit goals
//NOTE: to use in Goals History Page.
exports.getAllFitGoals = (req, res) => {
	fitgoalModel.find({}) 
	.then((goals) => {
		res.status(200).json({
			message: "Successfully retrieved all fit goals.",
			data: goals
		})
	}) 
	.catch((error) => {
		res.status(500).json({
			message: "Error retrieving all fit goals.",
			data: error
		})
	})
}



//Get fit goal by ID
exports.getFitGoalByID = (req, res) => {
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
}



//Edit fit goal by ID.
exports.updateFitGoalByID = (req, res) => {
	if (!req.params.id) {
		res.status(400).json({
			message: "Error. Request path id and request body id values must match."
    	});
    	return
  	}
  	const updated = {};
  	const updateableFields = ['title', 'description', 'completed'];
  	updateableFields.forEach(field => {
    	if (field in req.body) {
      		updated[field] = req.body[field];
    	}
  	});
  	//$set : mongoose functionality for updating specific fields selected in the db
  	fitgoalModel.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
	.then((updatedGoal) => {
		res.status(200).json({
			message: "Fit goal updated successfully.",
			data: updatedGoal
		})
	})	
	.catch((error) => {
		res.status(500).json({ 
			message: "Error updating fit goal."
		})	
	}) 	
}



//Delete fit goal by ID.
exports.deleteFitGoalByID = (req, res) => {
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
}
