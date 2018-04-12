const express = require('express');
const router = express.Router();
const categoryController = require('./category-controller');
const commonController = require('../common/common');


router.post('/new/:token', commonController.verifyToken, categoryController.postNewCategory);
router.get('/all/:token', commonController.verifyToken, categoryController.getAllCategories);
router.get('/:id/:token', commonController.verifyToken, categoryController.getCategoryByID);
// router.put('/:id', categoryController.updateCategoryByID);
router.delete('/:id/:token', commonController.verifyToken, categoryController.deleteCategoryByID);



module.exports = router;
