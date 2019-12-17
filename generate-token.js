const jwt = require('jsonwebtoken')
const environment = require('./environment')

const generateToken = (res, username) => {
    const expiration = environment.testing ? 500000 : 604800000;
    const token = jwt.sign({ username }, environment.JWT_SECRET, {
        expiresIn: environment.testing ? '1d' : '7d',
    });
    return res.cookie('token', token, {
        expires: new Date(Date.now() + expiration),
        secure: false, // set to true if your using https
        httpOnly: true,
    });
};

module.exports = generateToken;