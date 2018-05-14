'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const fitGoal = require('../fitgoal/fitgoal-model');
const user = require('../user/user-model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');


chai.use(chaiHttp);
let token;
let userId;
let fitGoalID;


function createUser() {
    console.log("Creating user.");
    let testUser = {
        name: "Zoya",
        username: "testing",
        password: "thisis10letterslong"
    }
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/user/register')
            .send(testUser)
            .then((res) => {
                console.log('Registered user.');
                loginUser().then(() => {
                    resolve()
                });
            })
            .catch((error) => {
                console.log(error)
                reject(error) //
            });
    });
}

function loginUser() {
    console.log('logging in user')
    let loginUser = {
        username: "testing",
        password: "thisis10letterslong"
    }
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post('/user/login')
            .send(loginUser)
            .then((res) => {
                token = res.body.data.token;
                userId = res.body.data.userID;
                resolve();
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            });
    });
}


function seedFitGoalData() {
    console.info('Seeding fitgoal data.');
    const seedData = [];

    for (let i = 0; i < 5; i++) {
        seedData.push(generateFitGoalData());
    }
    return fitGoal.insertMany(seedData);
}


function generateFitGoalTitle() {
    const titles = [
        'Run More', 'Lift More', 'Stretch More', 'Dance More', 'Water More'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
}


function generateFitGoalData() {
    return {
        userID: userId,
        createDate: Date.now(),
        title: generateFitGoalTitle(),
        description: faker.lorem.sentence(),
        completed: false
    };
}



function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


describe('test fitgoal API resources', function() {
    before(function(done) {
        console.log('before running server')
        runServer(TEST_DATABASE_URL) 
            .then(function() {
                createUser().then(function() { 
                    done(); 
                })
            })
    });

    after(function() {
        tearDownDb();
        return closeServer(); 
    });


    it('POST - should create logged-in test user', function() {
    	console.log("we should have a user here");
    	console.log(userId);
    	console.log("we should have a token here");
    	console.log(token);
        let res;
        return chai.request(app)
            .post('/goal/new')
            .send({
            	token: token,
            	userID: userId,
        		createDate: Date.now(),
        		title: "Rando Title",
        		description: "Rando description here.",
        		completed: false
            })
            .then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);
            })

    });


    it('GET - should return all existing fitgoals for logged-in test user', function() {
        let res;
        return chai.request(app)
            .get('/goal/all/' + `${token}`)
            .then(function(_res) {
                res = _res;
                fitGoalID = _res.body.data[0]._id;
                console.log('this is the fitGoalID');
                console.log(fitGoalID);
                expect(res).to.have.status(200);
            })
    		.catch((error) => {
    			console.log(error);
			});
    });


    it('GET - should return fit goal with requested ID', function() {
    	return chai.request(app)
            .get(`/goal/${fitGoalID}/${token}`)
        	.then(res => {
        		expect(res).to.have.status(200);
        		expect(res.body).to.be.a('object');
        	})
    		.catch((error) => {
    			console.log(error);
        });
    });


    it('PUT - should update requested ID fit goal', function(){
 			let updatedFitGoalInfo = {
 				token: token,
            	userID: userId,
        		createDate: Date.now(),
        		title: "Updated Title",
        		description: "Updated description here.",
        		completed: true
 			}
 			return chai.request(app)
 			.put(`/goal/${fitGoalID}/${token}`)
 			.send(updatedFitGoalInfo)
 				.then((res)=>{
 					expect(res).to.have.status(200);
 				})
 				.catch((error)=>{
 					console.log(error);
 				});
    });



    it('should delete fit goal with requested ID', function(){
    	return chai.request(app)
    	.delete(`/goal/${fitGoalID}/${token}`)
    		.then((res) => {
    			expect(res).to.have.status(200);
    		})
    		.catch((error) => {
    			console.log(error);
    		});
	});	 
});

