const express = require('express');
const router = express.Router();
const quoteController = require('./quote-controller');



//router.get('/all', quoteController.getAllQuotes);
router.get('/:id', quoteController.getQuoteByID);



module.exports = router;