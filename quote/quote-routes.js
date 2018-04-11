const express = require('express');
const router = express.Router();
const quoteController = require('./quote-controller');
const commonController = require('../common/common');



router.get('/random/:token', commonController.verifyToken, quoteController.getAllQuotes, quoteController.saveQuoteToUser );
//router.get('/:id', quoteController.getQuoteByID);
//router.post('/new', quoteController.postNewQuote);
//router.put('/:id', quoteController.updateQuoteByID);
//router.delete('/:id', quoteController.deleteQuoteByID);



module.exports = router;