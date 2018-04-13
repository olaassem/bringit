const dayplanModel = require('./dayplan-model');
const userModel = require('../user/user-model');



//Create new category
exports.postNewDayPlan = (req, res) => {
	console.log(req.body);
	let newDayPlan = new dayplanModel();
	newDayPlan.userID = req.body.userID;
	newDayPlan.categoryID = req.body.categoryID;
	newDayPlan.exerciseID = req.body.exerciseID;
	newCategory.activityID = req.body.activityID;
	newCategory.save()
	.then(( dayplan ) => {
		res.status(200).json({
			message: `New day plan saved.`,
			data: category
		})
	})
	.catch(( error ) =>{
		res.status(500).json({
			message: `Error saving new day plan.`,
			data: error
		})
	})
}