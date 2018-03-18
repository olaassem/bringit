const express = require('express');
const router = express.Router();
const fitgoalController = require('./fitgoal-controller');



router.post('/new', fitgoalController.postNewFitGoal);
router.get('/all', fitgoalController.getAllFitGoals);
router.get('/:id', fitgoalController.getFitGoalByID);
router.put('/:id', fitgoalController.updateFitGoalByID);
router.delete('/:id', fitgoalController.deleteFitGoalByID);



module.exports = router;
