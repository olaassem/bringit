const quoteModel = require('./quote-model');
const userModel = require('../user/user-model'); //access the user model


//Get all quotes
exports.getAllQuotes = (req, res, next) => {
	quoteModel.find({})
	.then((quotes) => {
		req.quotes = quotes;

		next();
	})
	.catch((error) => {
		res.status(500).json({
			message: "Error retrieving all quotes.",
			data: error
		})
	})
}

exports.saveQuoteToUser = (req, res) =>{
	//select one random quote
	let num = Math.floor(Math.random() * req.quotes.length);
	let randomQuote = req.quotes[num];
	console.log(randomQuote);
	//and save to user
	userModel.findByIdAndUpdate(req.user.id, { $set: { currentQuote: randomQuote.quote }} )
	.then((user) => {
		res.status(200).json({
			message: "Successfully saved random quote to user.",
			data: randomQuote.quote
		})

	})
	.catch((error) => {
		res.status(500).json({
			message: "Error saving random quote to user.",
			data: error
		})
	})
}
	