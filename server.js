

const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
//const mongoose = require('mongoose');


//start the routing
const app = express();


//Middlewares
//will use morgan and log common elements (not environmental or production)
app.use(morgan('common'));
app.use(bodyparser.json());
app.use(express.static('public'));




//routes
//this grabs the whole file. we then need to specify the prefix that will use this file
const routineroutes = require('./routes/routine');


//specify prefix for the route above
app.use('/routine', routineroutes);




//has to be final code
app.listen(8080, () => {
	console.log('server wrkoutapp running in port 8080');
})


