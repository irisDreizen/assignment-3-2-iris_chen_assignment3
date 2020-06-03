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

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json


router.post('/register', async (req, res, next) => {//chen
    try {
        let user_data = req.body;
        const users = await DButils.execQuery("SELECT userName FROM dbo.users");
        if (users.find((x) => x.userName === user_data.userName)) {
            res.status(409).send({message: "Username taken" });
        }
        
        else {
            var newUser = { ...req.body };
            if(newUser.password === newUser.confirmationPassword){
            await DButils.execQuery(`INSERT INTO dbo.Users VALUES (N'${newUser.userName}', N'${newUser.firstname}',N'${newUser.lastname}', HASHBYTES('SHA2_256','${newUser.password}'), N'${newUser.email}',N'${newUser.photoUrl}',N'${newUser.country}')`);
            res.status(201).send({ message: "user created", success: true });
            res.redirect("/");
            }
            else{
                res.status(409).send({message: "Confirmation Password does not match the Password" });
            }
        }
    } catch (error) {
        next(error);
    }
});

router.post('/login', async(req, res, next) => {//chen
    try {
    let user_data = req.body;
    const sha2_256 = require('simple-js-sha2-256')
    const users = await DButils.execQuery("SELECT userName, password FROM dbo.users");
    const user = users.find((x) => x.userName === user_data.userName && x.password == sha2_256(user_data.password));
    if (user != null) {
        if(req.session != null)
            req.session.id = user.userName;
        res.status(201).send({user});
    }
    else{
        res.status(409).send("Wrong Username or Password");
    }
} catch (error) {
    next(error);
}
});

router.post('/logout', async(req, res, next) => {// chen
    req.session.reset();
     res.redirect("/");
});

module.exports = router;

