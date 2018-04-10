const userModel = require('./user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //create tokens

//token is an object encrypted


//Register new user:
exports.postNewUser = (req, res) => {
    //1. have to 1st check if another user exists with entered user name in all the db.
    userModel.findOne({ username: req.body.username })
        .then((user) => {
            //if we have user, means that user already exists       
            if (user) {
                res.status(401).json({
                    message: `An account for this user already exists.`
                });
                return //stops. won't do anything else.
            }
            if (!req.body.name) {
                res.status(401).json({
                    message: `Please enter your first name.`
                });
                return
            }
            if (!req.body.username) {
                res.status(401).json({
                    message: 'Please provide a user name.'
                });
                return
            }
            if (!req.body.password) {
                res.status(401).json({
                    message: 'Please enter your password.'
                });
                return
            }



            //check that all input types strings.
            const stringFields = ['username', 'password', 'name'];
            const nonStringField = stringFields.find(
                field => field in req.body && typeof req.body[field] !== 'string'
            );

            if (nonStringField) {
                res.status(422).json({
                    message: 'Incorrect field type: expected string',
                    location: nonStringField
                });
                return
            }

            // If the username and password aren't trimmed, give an error.
            const explicityTrimmedFields = ['username', 'password'];
            const nonTrimmedField = explicityTrimmedFields.find(
                field => req.body[field].trim() !== req.body[field]
            );

            if (nonTrimmedField) {
                res.status(422).json({
                    message: 'User name and password cannot start or end with whitespace',
                    location: nonTrimmedField
                });
                return
            }

            const sizedFields = {
                password: {
                    min: 10,
                    max: 72
                }
            };
            const tooSmallField = Object.keys(sizedFields).find(
                field =>
                'min' in sizedFields[field] &&
                req.body[field].trim().length < sizedFields[field].min
            );
            const tooLargeField = Object.keys(sizedFields).find(
                field =>
                'max' in sizedFields[field] &&
                req.body[field].trim().length > sizedFields[field].max
            );

            if (tooSmallField || tooLargeField) {
                res.status(422).json({
                    message: tooSmallField ?
                        `Password must be at least ${sizedFields[tooSmallField]
                      .min} characters long` : `Password must be at most ${sizedFields[tooLargeField]
                      .max} characters long`,
                });
                return
            }

            let { username, password, name = '' } = req.body;
            // let username = req.body.username;
            // let password = req.body.password;
            // let name = req.body.name || "";
            // Username and password come in pre-trimmed, otherwise we throw an error
            // before this
            name = name.trim();



            //if we get to this line, it means we passed all the tests!! :D So, proceed to create new user:
            let newUser = new userModel();
            newUser.username = req.body.username;
            newUser.name = req.body.name;
            //encrypt password
            //takes 3 params : 1.password, 2.number of loops it will take to encrypt (10-12 recommended for security), 3.callback.
            //callback takes two params: error and hashed(string containing encrypted pass//synonym of encrypt).
            bcrypt.hash(req.body.password, 10, (error, hashed) => {
                if (error) {
                    res.status(401).json({
                        message: `Error encrypting password.`
                    })
                    return
                } else {
                    newUser.password = hashed;
                    newUser.save()
                        .then((user) => {
                            res.status(200).json({
                                message: `New user account created.`,
                                data: user
                            })
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: `Error creating new user account.`,
                                data: error
                            })
                        })
                }
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: `Error fetching user.`,
                data: error
            })
        })
}




//Login registered user:
exports.loginUser = (req, res) => {
    //1. have to 1st check if the user exists with same username in all the db.
    userModel.findOne({ username: req.body.username })
        .then((user) => {
            if (!req.body.username) {
                res.status(401).json({
                    message: 'Please enter your user name.'
                })
                return
            }
            if (!req.body.password) {
                res.status(401).json({
                    message: 'Please enter your password.'
                })
                return
            }
            //no user found means there is no account with this username in the db 
            if (!user) {
                res.status(401).json({
                    message: `No registered account found for this user.`
                })
                return //stops. won't do anything else.
            }
            //if we reach this point, user exists.
            //must check if password is the same.
            let passwordMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordMatch) {
                res.status(401).json({
                    message: `Entered password doesn't match account password.`
                })
                return //stops. won't do anything else.
            }
            //if we get here, user entered all required inputs, user exists (password matches).
            //create token.
            //this is the object we will encrypt --> will become the token!!!
            let userToken = {
                username: user.username,
                id: user._id
            }
            //
            let token = jwt.sign(userToken, "this is my secret"); //needs to be in .env file??
            res.status(200).json({
                message: 'User logged in.',
                data: {
                    token: token,
                    name: user.name,
                    userID: user._id
                }
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: `Error fetching user.`,
                data: error
            })
        })
}