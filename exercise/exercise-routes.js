const express = require('express');
const router = express.Router();
const exerciseController = require('./exercise-controller');



router.post('/new', exerciseController.postNewExercise);
router.get('/all', exerciseController.getAllExercises);
router.get('/:id', exerciseController.getExerciseByID);
router.put('/:id', exerciseController.updateExerciseByID);
router.delete('/:id', exerciseController.deleteExerciseyByID);



module.exports = router;