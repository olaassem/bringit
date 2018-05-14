const jwt = require('jsonwebtoken');
const config = require('../config');


exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.params.token || req.body.token;
    if (!token) {
        res.status(401).json({
            message: 'Token not provided.'
        })
        return
    }
    jwt.verify(token, config.JWT_SECRET, (error, decodeObject) => {
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