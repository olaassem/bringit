const express = require('express');
const router = express.Router();
const categoryController = require('./category-controller');
const commonController = require('../common/common');


router.post('/new/:token', commonController.verifyToken, categoryController.postNewCategory);
router.get('/all/:token', commonController.verifyToken, categoryController.getAllCategories);
router.get('/:id/:token', commonController.verifyToken, categoryController.getCategoryByID);
router.delete('/:id/:token', commonController.verifyToken, categoryController.deleteCategoryByID);
// router.put('/:id', categoryController.updateCategoryByID);



module.exports = router;
