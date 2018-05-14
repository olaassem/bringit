const express = require('express');
const router = express.Router();
const quoteController = require('./quote-controller');
const commonController = require('../common/common');



router.get('/random/:token', commonController.verifyToken, quoteController.getAllQuotes, quoteController.saveQuoteToUser );



module.exports = router;