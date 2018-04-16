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



// //Save day plan to user.
// exports.saveDayPlanToUser = (req, res) => {
//     dayplanModel.findByIdAndUpdate(req.user.id, {
//             $set: {
//                 // userID: dayplan.,
//                 // categoryID: ,
//                 // activityID: ,
//                 // exercisesIDs: ,
//                 // day: ,
//             }
//         }).then((user) => {
//             res.status(200).json({
//                 message: "Successfully saved day plan to user.",
//                 data: user
//             })

//         })
//         .catch((error) => {
//             res.status(500).json({
//                 message: "Error saving day plan to user.",
//                 data: error
//             })
//         })

// }






//Get all day plans
//hide and show each unique day plan on the front end
exports.getWeekByUser = (req, res) => {
    dayplanModel.find({ userID: req.user.id})
        .populate('activityID')
        .populate('categoryID')
        .populate('exercisesIDs')
        .exec()
        .then(( week ) => {
            res.status(200).json({
                message: `Successfully retrieved all day plans for user.`,
                data: week
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: `Error retrieving dayplan with ID ${req.params.id}.`,
                data: error
            })
        })
}