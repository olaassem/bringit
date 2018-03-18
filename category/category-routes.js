const express = require('express');
const router = express.Router();
const categoryController = require('./category-controller');



router.post('/new', categoryController.postNewCategory);
router.get('/all', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryByID);
router.put('/:id', categoryController.updateCategoryByID);
router.delete('/:id', categoryController.deleteCategoryByID);



module.exports = router;
