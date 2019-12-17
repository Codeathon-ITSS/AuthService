const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const generateToken = require('./generate-token');
const verifyToken = require('./verify-token');
const db = require('./database').database;

const server = express();
server.use(express.json());
server.use(cors());
server.use(cookieParser());

const PORT = 3000;

db.connect();

server.post("/registration", async (req, res) => {
    const { username, password } = req.body;
    try {
        await db.userRegister(username, password)
        res.status(200).send("Registration successfully");
    }
    catch (err) {
        res.status(200).send(err);
    }
});

server.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await db.getUser(username);
        if (user.hashPassword == password) {
            generateToken(res, username);
            res.status(200).send("Login successfully");
        }
    }
    catch (err) {
        res.status(401).send(err);
    }
});

server.post('/setdata', verifyToken, async (req, res) => {
    const { username, data } = req.body;
    try {
        await db.setData(username, data);
        res.status(200).send("Update successfully");
    }
    catch (err) {
        res.status(402).send(err);
    }
});

server.get('/getdata', verifyToken, async (req, res) => {
    const { username } = req.body;
    try {
        let user = await db.getUser(username);
        res.status(200).send(user.data);
    }
    catch (err) {
        res.status(505).send(err);
    }
});

server.get("/signout", (req, res) => {

});

server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
