const express = require('express');
const router = express.Router();
const quoteController = require('./quote-controller');



router.get('/all', quoteController.getAllQuotes);
//router.get('/:id', quoteController.getQuoteByID);
//router.post('/new', quoteController.postNewQuote);
//router.put('/:id', quoteController.updateQuoteByID);
//router.delete('/:id', quoteController.deleteQuoteByID);



module.exports = router;