const express = require('express');
const router = express.Router();
const activityController = require('./activity-controller');
const commonController = require('../common/common');



router.post('/new/:token', commonController.verifyToken, activityController.postNewActivity);
router.get('/:id/:token', commonController.verifyToken, activityController.getActivityByID);
router.get('/all', activityController.getAllActivities);
router.put('/:id', activityController.updateActivityByID);
router.delete('/:id', activityController.deleteActivityByID);



module.exports = router;



