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
        .then((activity) => {

            req.activityID = activity._id;

            next();
        })
        .catch((error) => {
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
    dayplanModel.find({ userID: req.user.id })
        .populate('activityID')
        .populate('categoryID')
        .populate('exercisesIDs')
        .exec()
        .then((week) => {
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





//Edit dayplan by ID
exports.updateDayPlanByID = (req, res, next) => {
    if (!req.params.dayplanid) {
        res.status(400).json({
            message: "Error. Request path id and request body id values must match - dayplan."
        })
    }

    let updated = {};
    const updateableFields = ['categoryID', 'activityID', 'exercisesIDs'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    })
    console.log(updated);
    //$set use to change one field
    dayplanModel.findByIdAndUpdate(req.params.dayplanid, { $set: updated }, { new: true })
        .then((updatedDayPlan) => {

            req.activityID = updatedDayPlan.activityID
            next();
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error updating day plan."
            })
        })
}


//Update activity by ID
exports.updateActivityByID = (req, res) => {

    if (!req.activityID) {
        res.status(400).json({
            message: "Error. Request path id and request body id values must match - activity."
        });
    }

    let updated = {};
    const updateableFields = ["name", "time", "duration", "cardio", "routine",
        "location", "inspiration"
    ];
    updateableFields.forEach(field => {
        if (field in req.body.activity) {
            updated[field] = req.body.activity[field];
        }
    })
    console.log(updated);
    activityModel.findByIdAndUpdate(req.activityID, { $set: updated }, { new: true })
        .then((updatedActivity) => {
            res.status(200).json({
                message: "Day plan updated successfully.",
                data: updatedActivity
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: "Error updating activity."
            })
        })
}