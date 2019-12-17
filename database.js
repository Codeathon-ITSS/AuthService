const environment = require('./environment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//const bcrypt = require('bcrypt');


function connect() {
    return new Promise((resolve, reject) => {
        mongoose.connect(environment.db, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        })
    })
}


const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    hashPassword: String,
    data: {}
}))

function userRegister(username, password) {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username }).count().exec((err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result == 0) {
                User.create({
                    username: username,
                    hashPassword: password,
                });
                resolve("Registered");
            }
            else {
                reject(username + " already existed");
            }
        })
    })
}

function getUser(username) {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username }, (err, result) => {
            if (err) {
                reject(err)
                return;
            }
            resolve(result);
        });
    });
}

function setData(username, data) {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            result.set("data", data);
            result.save();
            resolve("Update success");
        })
    });
}

module.exports = {
    database: {
        connect: connect,
        models: User,
        userRegister: userRegister,
        getUser: getUser,
        setData: setData
    }
}