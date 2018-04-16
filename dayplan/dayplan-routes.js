const express = require('express');
const router = express.Router();
const dayplanController = require('./dayplan-controller');
const commonController = require('../common/common');



router.post('/new/:token', commonController.verifyToken, dayplanController.postNewActivity, dayplanController.postNewDayPlan);
router.get('/all/:token', commonController.verifyToken, dayplanController.getWeekByUser);
// router.put('/:id:token', commonController.verifyToken,);
// router.delete('/:id:token', commonController.verifyToken,);



module.exports = router;