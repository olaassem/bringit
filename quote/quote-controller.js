const quoteModel = require('./quote-model');



//Get all quotes
exports.getAllQuotes = (req, res) => {
	quoteModel.find({})
	.then((quotes) => {
		res.status(200).json({
			message: "Successfully retrieved all quotes.",
			data: quotes 
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: "Error retrieving all quotes.",
			data: error
		})
	})
}


/*
//Get quote by ID
exports.getQuoteByID = (req, res) => {
	quoteModel.findById(req.params.id)
	.then((quote) => {
		res.status(200).json({
			message: `Successfully retrieved quote with ID ${req.params.id}.`,
			data: quote
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: `Error retrieving quote with ID ${req.params.id}.`,
			data: error
		})
	})
}



exports.postNewQuote = ( req, res) => {
	//creating an object with the keys/values defined in bookSchema
	let newFitGoal = new fitgoalModel();
	newFitGoal.title = req.body.title;
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



//Edit quote by ID.
exports.updateQuoteByID = (req, res) => {
	if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
		res.status(400).json({
			message: "Error. Request path id and request body id values must match."
    	});
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
			message: "Fit goal updated successfully."
		})
	})	
	.catch((error) => {
		res.status(500).json({ 
			message: "Error updating fit goal."
		})	
	}) 	
}



//Delete quote by ID.
exports.deleteQuoteByID = (req, res) => {
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

*/