'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
// const faker = require('faker');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout this module
const expect = chai.expect;

const fitGoal = require('../fitgoal-model');
const user = require('../user-model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);


let token;
let userId;


//register user test
function createUser() {
    console.log("creating user");
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
                console.log('inside of create test user')
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

