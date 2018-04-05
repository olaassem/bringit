const express = require('express');
const router = express.Router();
const userController = require('./user-controller');



router.post('/register', userController.postNewUser);
router.post('/login', userController.loginUser);



module.exports = router;

