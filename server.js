

const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const {PORT, DATABASE_URL} = require('./config');
const app = express();
mongoose.Promise = global.Promise;


//MIDDLEWARE
app.use(morgan('common'));
app.use(bodyparser.json());
app.use(express.static('public'));


//ROUTES
const fitGoal = require('./fitgoal/fitgoal-routes');
const category = require('./category/category-routes');
const activity = require('./activity/activity-routes');
const exercise = require('./exercise/exercise-routes');
const quote = require('./quote/quote-routes');
const user = require('./user/user-routes');
const dayplan = require('./dayplan/dayplan-routes');


//PREFIXES
app.use('/goal', fitGoal);
app.use('/category', category);
app.use('/activity', activity);
app.use('/exercise', exercise);
app.use('/quote', quote);
app.use('/user', user);
app.use('/dayplan', dayplan);



app.use('*', function (req, res) {
	res.status(404).json({ 
		message: 'Not Found' 
	});
});



let server;


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



if (require.main === module) {
  runServer(DATABASE_URL).catch(error => console.error(error));
}

module.exports = { app, runServer, closeServer };
