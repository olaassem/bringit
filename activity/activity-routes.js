const express = require('express');
const router = express.Router();
const activityController = require('./activity-controller');



router.post('/new', activityController.postNewActivity);
router.get('/all', activityController.getAllActivities);
router.get('/:id', activityController.getActivityByID);
router.put('/:id', activityController.updateActivityByID);
router.delete('/:id', activityController.deleteActivityByID);



module.exports = router;



