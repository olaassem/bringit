'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout this module
const expect = chai.expect;

const fitGoal = require('../fitgoal/fitgoal-model');
const user = require('../user/user-model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');


chai.use(chaiHttp);
let token;
let userId;


//register user
function createUser() {
    console.log("Creating user.");
    let testUser = {
        name: "Zoya",
        username: "testing",
        password: "testpass"
    }
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/user/register')
            .send(testUser)
            .then((res) => {
                console.log('Registered user.')
                loginUser().then(() => {
                    resolve()
                });
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            });
    });
}

function loginUser() {
    console.log('logging in user')
    let loginUser = {
        username: "testing",
        password: "testpass"
    }
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/user/login')
            .send(loginUser)
            .then((res) => {
                token = res.body.token;
                userId = res.body.userId;
                resolve();
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            });
    });
}


// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedFitGoalData() {
    console.info('Seeding fitgoal data.');
    const seedData = [];

    for (let i = 0; i < 5; i++) {
        seedData.push(generateFitGoalData());
    }
    // this will return a promise
    return fitGoal.insertMany(seedData);
}


// used to generate data to put in db
function generateFitGoalTitle() {
    const titles = [
        'Run More', 'Lift More', 'Stretch More', 'Dance More', 'Water More'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
}


// generate an object represnting a fit goal.
// can be used to generate seed data for db
// or request.body data
function generateFitGoalData() {
    return {
        userID: userID,
        createDate: Date.now(),
        title: generateFitGoalTitle(),
        description: faker.lorem.sentence(),
        completed: false
    };
}


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one.
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


describe('test fitgoal API resources', function() {
	// we need each of these hook functions to return a promise
	// otherwise we'd need to call a `done` callback. `runServer`,
	// `seedFitGoalData` and `tearDownDb` each return a promise,
	// so we return the value returned by these function calls.
	before(function(done){
		Promise.resolve(runServer(TEST_DATABASE_URL)).then(() => {
			Promise.resolve(createUser()).then(() => {
        		done()
      		});
    	});
  	});
	
	after(function() {
    	tearDownDb();
    	closeServer();
  	});

	// note the use of nested `describe` blocks.
	// this allows us to make clearer, more discrete tests that focus
	// on proving something small
	describe('GET endpoint', function() {

	it('should return all existing fitgoals for logged in test user', function() {
	// strategy:
	//    1. get back all fitgoals returned by by GET request to `/goal/all/:token`
	//    2. prove res has right status, data type
	//    3. prove the number of fitgoals we got back is equal to number
	//       in db.
	//
	// need to have access to mutate and access `res` across
	// `.then()` calls below, so declare it here so can modify in place
	let res;
	return chai.request(app)
	    .get('/goal/all' + `${token}`)  //CHANGE THIS TO USER ID?
	    .then(function(_res) {
	        // so subsequent .then blocks can access response object
	        res = _res;
	        expect(res).to.have.status(200);
	        // otherwise our db seeding didn't work
	        expect(res.body).to.have.lengthOf.at.least(1);
	        return fitGoal.count();
	    })
	    .then(function(count) {
	        expect(res.body).to.have.lengthOf(count);
	    });
	});


	it('should return fit goals with right fields', function() {
	// Strategy: Get back all fitgoals, and ensure they have expected keys

	let resFitGoal;
	return chai.request(app)
	    .get('/goal/all' + `${token}`)
	    .then(function(res) {
	        expect(res).to.have.status(200);
	        expect(res).to.be.json;
	        expect(res.body).to.be.a('object');
	        expect(res.body).to.have.lengthOf.at.least(1);

	        res.body.forEach(function(fitgoal) {
	            expect(fitgoal).to.be.a('object');
	            expect(fitgoal).to.include.keys(
	                '_id', 'userID', 'createDate', 'title', 'description', 'completed');
	        });
	        resFitGoal = res.body.fitgoals[0];
	        return fitGoal.findById(resFitGoal._id);
	    })
	    .then(function(fitGoal) {

	        expect(resFitGoal._id).to.equal(fitGoal._id);
	        expect(resFitGoal.userID).to.equal(fitGoal.userID);
	        expect(resFitGoal.createDate).to.equal(fitGoal.createDate);
	        expect(resFitGoal.title).to.equal(fitGoal.title);
	        expect(resFitGoal.description).to.equal(fitGoal.description);
	        expect(resFitGoal.completed).to.equal(fitGoal.completed);
	    });
	});
});