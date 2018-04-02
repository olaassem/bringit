const exerciseModel = require('./exercise-model');


//Create new exercise
exports.postNewExercise = (req, res) => {
	let newExercise = new exerciseModel();
	newExercise.activityID = req.body.activityID;
	newExercise.name = req.body.name;
	newExercise.sets = req.body.sets;
	newExercise.reps = req.body.reps;
	newExercise.weight = req.body.weight;
	newExercise.save()
	.then((exercise) => {
		res.status(200).json({
			message: `New exercise (${newExercise.name}) saved.`,
			data: exercise
		})
	})
	.catch((error) =>{
		res.status(500).json({
			message: `Error saving new (${newExercise.name}) exercise.`,
			data: error
		})
	})
}





//Get all exercises
exports.getAllExercises = (req, res) => {
	exerciseModel.find({})
	.then((exercises) => {
		res.status(200).json({
			message: "Successfully retrieved all exercises.",
			data: exercises 
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: "Error retrieving all exercises.",
			data: error
		})
	})
}



//Get exercise by ID
exports.getExerciseByID = (req, res) => {
	exerciseModel.findById(req.params.id)
	.then((exercise) => {
		res.status(200).json({
			message: `Successfully retrieved exercise with ID ${req.params.id}.`,
			data: exercise
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: `Error retrieving exercise with ID ${req.params.id}.`,
			data: error
		})
	})
}



//Edit category by ID
exports.updateExerciseByID = (req, res) => {
	if(!req.params.id){
		res.status(400).json({
			message: "Error. Request path id and request body id values must match."
		})
	}
	const updated = {};
	const updateableFields =  ['name', 'sets', 'reps', 'weight'];
	updateableFields.forEach( field =>{
		if( field in req.body){
			updated[field] = req.body[field];
		}
	})
  	exerciseModel.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
	.then((updatedExercise) => {
		res.status(200).json({
			message: "Exercise updated successfully.",
			data: updatedExercise
		})
	})	
	.catch((error) => {
		res.status(500).json({ 
			message: "Error updating exercise."
		})	
	}) 
}



//Delete category by ID
exports.deleteExerciseyByID = (req, res) => {
	exerciseModel.findByIdAndRemove(req.params.id)
	.then(() => {
		res.status(200).json({
			message: `Successfully deleted exercise with ID ${req.params.id}.`
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: `Error deleting exercise with ID ${req.params.id}.`,
			data: error
		})
	})
}