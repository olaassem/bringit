const dayplanModel = require('./dayplan-model');
const userModel = require('../user/user-model');
const activityModel = require('../activity/activity-model');
const categoryModel = require('../category/category-model');
const exerciseModel = require('../exercise/exercise-model');




//Create new activity.
exports.postNewActivity = (req, res, next) => {

    let newActivity = new activityModel();
    newActivity.userID = req.body.userID;
    newActivity.name = req.body.activity.name;
    newActivity.time = req.body.activity.time;
    newActivity.duration = req.body.activity.duration;
    newActivity.cardio.distance = req.body.activity.cardio.distance;
    newActivity.cardio.duration = req.body.activity.cardio.duration;
    newActivity.routine = req.body.activity.routine;
    newActivity.location = req.body.activity.location;
    newActivity.inspiration = req.body.activity.inspiration;
    newActivity.completed = req.body.activity.completed;


	newActivity.save()
	.then(( activity ) => {

        req.activityID = activity._id;

		next();
	})
	.catch(( error ) => {
		res.status(500).json({
			message: `Error saving new activity (${newActivity.name}).`,
			data: error
		})
	})
}


//Create new day plan.
exports.postNewDayPlan = (req, res, next) => {
    console.log(req.body);
    let newDayPlan = new dayplanModel();
    newDayPlan.userID = req.body.userID;
    newDayPlan.categoryID = req.body.categoryID;
    newDayPlan.activityID = req.activityID;
    newDayPlan.exercisesIDs = req.body.exercisesIDs;
    newDayPlan.day = req.body.day;

    newDayPlan.save()
        .then((dayplan) => {
            res.status(200).json({
                message: `New day plan saved.`,
                data: dayplan
            })
            next();
        })
        .catch((error) => {
            res.status(500).json({
                message: `Error saving new day plan.`,
                data: error
            })
        })
}


//Get all day plans
exports.getWeekByUser = (req, res) => {
    dayplanModel.find({ userID: req.user.id})
        .populate('activityID')
        .populate('categoryID')
        .populate('exercisesIDs')
        .exec()
        .then(( week ) => {
            res.status(200).json({
                message: `Successfully retrieved week for user.`,
                data: week
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: `Error retrieving week for user.`,
                data: error
            })
        })
}



//Delete day plan by ID
exports.deleteDayPlanByID = (req, res) => {
    dayplanModel.findByIdAndRemove(req.params.id)
    .then(() => {
        res.status(200).json({
            message: `Successfully deleted day plan with ID ${req.params.id}.`
        })
    })
    .catch((error) => {
        res.status(500).json({
            message: `Error deleting day plan with ID ${req.params.id}.`,
            data: error
        })
    })
}


//Get day plan by ID
exports.getDayPlanByID = (req, res) => {
    dayplanModel.findById(req.params.id)
        .populate('activityID')
        .populate('categoryID')
        .populate('exercisesIDs')
        .exec()
    .then((dayplan) => {
        res.status(200).json({
            message: `Successfully retrieved day plan with ID ${req.params.id}.`,
            data: dayplan
        })
    })
    .catch((error) => {
        res.status(500).json({
            message: `Error retrieving day plan with ID ${req.params.id}.`,
            data: error
        })
    })
}




