const userModel = require('./user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');



//Register new user:
exports.postNewUser = (req, res) => {
    userModel.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                res.status(401).json({
                    message: `An account for this user already exists.`
                });
                return
            }
            if (!req.body.name) {
                res.status(401).json({
                    message: `Please enter your first name.`
                });
                return
            }
            if (!req.body.username) {
                res.status(401).json({
                    message: 'Please enter a username.'
                });
                return
            }
            if (!req.body.password) {
                res.status(401).json({
                    message: 'Please enter a password.'
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
                    message: 'Username and password cannot start or end with whitespace',
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

            name = name.trim();



            let newUser = new userModel();
            newUser.username = req.body.username;
            newUser.name = req.body.name;
            newUser.created = req.body.created;

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




exports.loginUser = (req, res) => {
    userModel.findOne({ username: req.body.username })
        .then((user) => {
            if (!req.body.username) {
                res.status(401).json({
                    message: 'Please enter your username.'
                })
                return
            }
            if (!req.body.password) {
                res.status(401).json({
                    message: 'Please enter your password.'
                })
                return
            }
            if (!user) {
                res.status(401).json({
                    message: `No registered account found for this user.`
                })
                return 
            }
            let passwordMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordMatch) {
                res.status(401).json({
                    message: `Entered password doesn't match account password.`
                })
                return 
            }

            let userToken = {
                username: user.username,
                id: user._id
            }

            let token = jwt.sign(userToken, config.JWT_SECRET); 
            res.status(200).json({
                message: 'User logged in.',
                data: {
                    token: token,
                    name: user.name,
                    userID: user._id,
                    currentQuote: user.currentQuote
                }
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: `Error fetching user.`,
                data: error
            })
        })
}