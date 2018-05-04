

const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');


require('dotenv').config();


// const dotenv = require('dotenv');
// const result = dotenv.config();


const {PORT, DATABASE_URL} = require('./config');
console.log(DATABASE_URL);

//Start the routing
const app = express();


//config.js
//CONNECT TO MONGOLAB DATABASE
// mongoose.connect('mongodb://olaassem:11natel7abl77@ds115411.mlab.com:15411/wrkoutapp');
mongoose.Promise = global.Promise;
// //Retrives database connected at the moment
// let db = mongoose.connection;
// //FEEDBACK THAT THE DB IS OK:
// //on error
// db.on('error', console.error.bind(console, 'Connection error:'));
// //everything running correctly
// db.once('open', function () { console.log('Connected to a database') });


//all variables stored in .env file will go to the server env
// dotenv.config({path:'./.env'});

//MIDDLEWARE
//Use morgan to log common elements (not environmental or production)
app.use(morgan('common'));
app.use(bodyparser.json());
app.use(express.static('public'));



//ROUTES
//This grabs the whole file. 
//We specify the prefix that will use for each file below in PREFIXES.
const fitGoal = require('./fitgoal/fitgoal-routes');
const category = require('./category/category-routes');
const activity = require('./activity/activity-routes');
const exercise = require('./exercise/exercise-routes');
const quote = require('./quote/quote-routes');
const user = require('./user/user-routes');
const dayplan = require('./dayplan/dayplan-routes');


//PREFIXES
//specify prefix for the route above
//app.use('/week', weekPlan);
app.use('/goal', fitGoal);
app.use('/category', category);
app.use('/activity', activity);
app.use('/exercise', exercise);
app.use('/quote', quote);
app.use('/user', user);
app.use('/dayplan', dayplan);


// //PORT LISTEN
// //Must be final code
// app.listen(8080, () => {
// 	console.log('server wrkoutapp running in port 8080');
// })



// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function (req, res) {
	res.status(404).json({ 
		message: 'Not Found' 
	});
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, error => {
      if (error) {
        return reject(error);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', error => {
          mongoose.disconnect();
          reject(error);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(error => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(error => console.error(error));
}

module.exports = { app, runServer, closeServer };
