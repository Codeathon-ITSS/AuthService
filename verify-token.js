const jwt = require('jsonwebtoken');
const environment = require('./environment');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token || '';
    try {
        if (!token) {
            return res.status(401).json('Permission denied')
        }
        const decrypt = await jwt.verify(token, environment.JWT_SECRET);
        req.user = {
            username: decrypt.username,
        };
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }
};

module.exports = verifyToken;