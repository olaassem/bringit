const express = require('express');
const router = express.Router();
const dayplanController = require('./dayplan-controller');
const commonController = require('../common/common');



router.post('/new/:token', commonController.verifyToken, dayplanController.postNewActivity, dayplanController.postNewDayPlan);
router.get('/all/:token', commonController.verifyToken, dayplanController.getWeekByUser);
router.get('/:id/:token', commonController.verifyToken, dayplanController.getDayPlanByID);
router.put('/:dayplanid/:token', commonController.verifyToken, dayplanController.updateDayPlanByID, dayplanController.updateActivityByID);
router.delete('/:id/:token', commonController.verifyToken, dayplanController.deleteDayPlanByID);



module.exports = router;