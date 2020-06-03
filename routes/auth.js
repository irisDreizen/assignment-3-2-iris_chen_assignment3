var express = require("express");
var router = express.Router();
//#region global imports
require("dotenv").config();
const axios = require("axios");
//#region express configures
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var DButils = require("../DButils")
const bcrypt = require("bcryptjs");


var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json


router.post('/register', async (req, res, next) => {//chen
    try {
        let user = req.body;
        const users = await DButils.execQuery("SELECT username FROM dbo.Users");
        if (users.find((x) => x.userName === user.userName)) {
            res.status(400).send({ message: "Username taken" });
        }

        else {
            
            if (req.body.password === req.body.confirmationPassword) {
                let hash_password = bcrypt.hashSync(
                    req.body.password,
                    parseInt(process.env.bcrypt_saltRounds)
                );
                await DButils.execQuery(`INSERT INTO dbo.Users VALUES ('${req.body.userName}', '${req.body.firstname}','${req.body.lastname}','${req.body.country}', '${hash_password}', '${req.body.email}','${req.body.linkimage}')`);
                res.status(201).send({ message: "user created", success: true });
                res.redirect("/");
            }
            else {
                res.status(409).send({ message: "Confirmation Password does not match the Password" });
            }
        }
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {//chen
    try {
        let user_data = req.body;
        const sha2_256 = require('simple-js-sha2-256')
        const users = await DButils.execQuery("SELECT userName, password FROM dbo.users");
        const user = users.find((x) => x.userName === user_data.userName && x.password == sha2_256(user_data.password));
        if (user != null) {
            if (req.session != null)
                req.session.id = user.userName;
            res.status(201).send({ user });
        }
        else {
            res.status(409).send("Wrong Username or Password");
        }
    } catch (error) {
        next(error);
    }
});

router.post('/logout', async (req, res, next) => {// chen
    req.session.reset();
    res.redirect("/");
});

module.exports = router;

