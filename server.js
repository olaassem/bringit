

const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');



//Start the routing
const app = express();



//CONNECT TO MONGOLAB DATABASE
mongoose.connect('mongodb://olaassem:11natel7abl77@ds115411.mlab.com:15411/wrkoutapp');
mongoose.Promise = global.Promise;
//Retrives database connected at the moment
let db = mongoose.connection;
//FEEDBACK THAT THE DB IS OK:
//on error
db.on('error', console.error.bind(console, 'Connection error:'));
//everything running correctly
db.once('open', function () { console.log('Connected to a database') });



//MIDDLEWARE
//Use morgan to log common elements (not environmental or production)
app.use(morgan('common'));
app.use(bodyparser.json());
app.use(express.static('public'));



//ROUTES
//This grabs the whole file. 
//We specify the prefix that will use for each file below in PREFIXES.
const weekplan = require('./routes/weekplan-routes');


//PREFIXES
//specify prefix for the route above
app.use('/week', weekplan);



//PORT LISTEN
//Must be final code
app.listen(8080, () => {
	console.log('server wrkoutapp running in port 8080');
})


