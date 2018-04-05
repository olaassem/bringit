const userModel = require('./user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');//create tokens

//token is an object encrypted


//Register new user:


exports.postNewUser = (req, res) => {
    //1. have to 1st check if another user exists with same email in all the db.
    userModel.findOne({ email: req.body.email })
        .then((user) => {
            //if we have user, means that user already exists   	
            if (user) {
                res.status(401).json({
                    message: `User already exists.`
                })
                return //stops. won't do anything else.
            }
            //if we get to this line, it means that user doesnt exist. So, we create 1
            let newUser = new userModel();
            newUser.email = req.body.email;
            newUser.name = req.body.name;
            //encrypt password
            //takes 3 params : password, how many loops it will take to encrypt (with 8-10 its enough), callback.
            //callback takes two params: error and hashed(string containing encrypted pass//synonym of encrypt).
            bcrypt.hash(req.body.password, 8, (error, hashed) => {
                if (error) {
                    res.status(401).json({
                        message: `Error encrypting the password.`
                    })
                    return
                } else {
                    newUser.password = hashed;
                    newUser.save()
                        .then((user) => {
                            res.status(200).json({
                                message: `New user saved.`,
                                data: user
                            })
                        })
                        .catch((error) => {
                            res.status(500).json({
                                message: `Error saving new user.`,
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
    //1. have to 1st check if the user exists with same email in all the db.
    userModel.findOne({ email: req.body.email })
        .then((user) => {
            //if we have user, means that user already exists   	
            if (!user) {
                res.status(401).json({
                    message: `This user isn't registered.`
                })
                return //stops. won't do anything else.
            }
            //if reach this point, user exists.
            //must check if password is the same.
            let passwordMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordMatch) {
                res.status(401).json({
                    message: `Password doesn't match.`
                })
                return //stops. won't do anything else.
            }
            //if we get here, user exists (password matches).
            //create token.
            //this is the object we will encrypt --> will become the token!!!
            let userToken = {
            	email: user.email,
            	id: user._id
            }
            //
            let token = jwt.sign( userToken, "this is my secret");
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