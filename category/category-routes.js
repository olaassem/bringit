const express = require('express');
const router = express.Router();
const categoryController = require('./category-controller');
const commonController = require('../common/common');


router.post('/new', categoryController.postNewCategory);
router.get('/all', commonController.verifyToken, categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryByID);
router.put('/:id', categoryController.updateCategoryByID);
router.delete('/:id', categoryController.deleteCategoryByID);



module.exports = router;
