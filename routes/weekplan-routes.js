const express = require('express');

const router = express.Router();



//create basic route with 1 console.log
router.get('/week', (req, res) => {
	res.status(200).json({
		message: "this week's schedule."});
})






//EXPORT THE ROUTER
//Must be the last code (use this order)
module.exports = router;



