const quoteModel = require('./quote-model');



//Get all exercises
exports.getAllQuotes = (req, res) => {
	quoteModel.find({})
	.then((quotes) => {
		res.status(200).json({
			message: "Successfully retrieved all exercises.",
			data: quotes 
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: "Error retrieving all exercises.",
			data: error
		})
	})
}



//Get exercise by ID
exports.getQuoteByID = (req, res) => {
	quoteModel.findById(req.params.id)
	.then((quote) => {
		res.status(200).json({
			message: `Successfully retrieved quote with ID ${req.params.id}.`,
			data: quote
		})
	})
	.catch((error) => {
		res.status(500).json({
			message: `Error retrieving quote with ID ${req.params.id}.`,
			data: error
		})
	})
}


