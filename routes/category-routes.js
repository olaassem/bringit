const express = require('express');
//Require activity model file
const categoryModel = require('../models/category-model');

const router = express.Router();



/***   ENDPOINTS   ***/



//Create new category
router.post('/new', (req, res) => {
	let newCategory = new categoryModel();
	newCategory.name = req.body.name;
	newCategory.img = req.body.img;
	newCategory.save()
	.then((category) => {
		res.status(200).json({
			message: `New category (${newCategory.name}) saved.`,
			data: category
		})
	})
	.catch((error) =>{
		res.status(500).json({
			message: `Error saving new (${newCategory.name}) category.`,
			data: error
		})
	})
})



//Get all categories
router.get('/all', (req, res) => {
	categoryModel.find({})
	.then((categories) => {
		res.status(200).json({
			message: "Retrieved all categories successfully.",
			data: categories 
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: "Error retrieving all categories.",
			data: error
		})
	})
})



//Get category by ID
router.get('/:id', (req, res) => {
	categoryModel.findById(req.params.id)
	.then((category) => {
		res.status(200).json({
			message: `Successfully retrieved category with ID ${req.params.id}.`,
			data: category
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: `Error retrieving category with ID ${req.params.id}.`,
			data: error
		})
	})
})



//Edit category by ID
router.put('/:id', (req, res) => {
	if(!(req.params.id  && req.body.id && req.params.id === req.body.id)){
		res.status(400).json({
			message: "Error. Request path id and request body id values must match."
		})
	}
	const updated = {};
	const updateableFields =  ['name', 'img'];
	updateableFields.forEach( field =>{
		if( field in req.body){
			updated[field] = req.body[field];
		}
	})
  	categoryModel.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
	.then((updatedCategory) => {
		res.status(200).json({
			message: "Category updated successfully."
		})
	})	
	.catch((error) => {
		res.status(500).json({ 
			message: "Error updating category."
		})	
	}) 
})



//Delete category by ID
router.delete('/:id', (req, res) => {
	newCategory.findByIdAndRemove(req.params.id)
	.then(() => {
		res.status(200).json({
			message: `Successfully deleted category with ID ${req.params.id}.`
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: `Error deleting category with ID ${req.params.id}.`,
			data: error
		})
	})
})




module.exports = router;