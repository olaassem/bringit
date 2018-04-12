const express = require('express');
const router = express.Router();
const dayplanController = require('./dayplan-controller');
const commonController = require('../common/common');



router.post('/new/:token', commonController.verifyToken, exerciseController.postNewExercise);
// router.get('/:id/:token', commonController.verifyToken, exerciseController.getExerciseByID);
// router.put('/:id:token', commonController.verifyToken,exerciseController.updateExerciseByID);
// router.delete('/:id:token', commonController.verifyToken,exerciseController.deleteExerciseyByID);



module.exports = router;