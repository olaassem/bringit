const express = require('express');
const router = express.Router();
const exerciseController = require('./exercise-controller');
const commonController = require('../common/common');



router.post('/new/:token', commonController.verifyToken, exerciseController.postNewExercise);
router.get('/all/:token', commonController.verifyToken, exerciseController.getAllExercises);
router.put('/:id/:token', commonController.verifyToken, exerciseController.updateExerciseByID);
router.delete('/:id/:token', commonController.verifyToken, exerciseController.deleteExerciseyByID);
router.get('/:id/:token', commonController.verifyToken, exerciseController.getExerciseByID);



module.exports = router;