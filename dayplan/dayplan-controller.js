const dayplanModel = require('./dayplan-model');
const userModel = require('../user/user-model');
const activityModel = require('../activity/activity-model');
const categoryModel = require('../category/category-model');
const exerciseModel = require('../exercise/exercise-model');



//Get Activity model and save it.
exports.getActivityByID = (req, res, next) => {
	activityModel.findById(req.params.id)
	.then((activity) => {
		// res.status(200).json({
		// 	message: `Successfully retrieved activity with ID ${req.params.id}.`,
		// 	data: activity
		// })
		next();
	})
	.catch((error) => {
		res.status(500).json({
			message: `Error retrieving activity with ID ${req.params.id}.`,
			data: error
		})
	})
}



//Save day
exports.saveDay = () => {

}



//Create new day plan.
exports.postNewDayPlan = (req, res, next) => {
	console.log(req.body);
	let newDayPlan = new dayplanModel();
	newDayPlan.userID = mongoose.Types.ObjectId(req.body.userID);
	newDayPlan.categoryID = mongoose.Types.ObjectId(req.body.categoryID);
	newDayPlan.exerciseID = mongoose.Types.ObjectId(req.body.exerciseID);
	newDayPlan.activityID = mongoose.Types.ObjectId(req.body.activityID);

	newDayPlan.save()
	.then(( dayplan ) => {
		res.status(200).json({
			message: `New day plan saved.`,
			data: category
		})
		next();
	})
	.catch(( error ) =>{
		res.status(500).json({
			message: `Error saving new day plan.`,
			data: error
		})
	})
}

//Save day plan to user.
exports.saveDayPlanToUser = ( req, res ) => {
	dayplanModel.findByIdAndUpdate(req.user.id, { $set: 
		{  
			userID: ,
		    categoryID:  , 
		    activityID:  ,
		    exercisesIDs:  ,
		    day: ,
		}
	}).then(( user ) => {
		res.status(200).json({
			message: "Successfully saved day plan to user.",
			data: user
		})

	})
	.catch(( error ) => {
		res.status(500).json({
			message: "Error saving day plan to user.",
			data: error
		})
	})

}





