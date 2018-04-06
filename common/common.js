//need JWT
const jwt = require('jsonwebtoken');




exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.params.token;
    //check if token exists
    if (!token) {
        res.status(401).json({
            message: 'token not provided'
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