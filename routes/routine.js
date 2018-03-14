const express = require('express');

const router = express.Router();


//create basic route with 1 console.log

router.get('/week', (req, res) => {
	res.status(200).json({
		message: "this week's schedule."});
})






//start exporting the router
//has to be the last code (use this order)
module.exports = router;



//create model and modelSchema for the routine
//think of new models (user, gym, profile, etc)
//make basic endpoints (Create, getById, Delete, etc)
//connect with database / connect mongolab with app
//serve static files (Jon)