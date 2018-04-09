//need JWT
const jwt = require('jsonwebtoken');



//will be executed before the endpoints (requests)
//here we expect the token in the the req.headers.authorization || req.params.token
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.params.token || req.body.token;
    //check if token exists
    if (!token) {
        res.status(401).json({
            message: 'Token not provided.'
        })
        return
    }
    //token exists
    jwt.verify(token, "this is my secret", (error, decodeObject) => {
        if (error) {
            res.status(500).json({
                message: 'token is not valid'
            })
            return
        }
        req.user = decodeObject;
        next();
    })
}