var saltRounds = 10;
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("client-sessions");

//#region global imports
const axios = require("axios");
const CryptoJS = require("crypto-js");
require("dotenv").config();

var DButils = require("./DButils")
const bcrypt = require("bcrypt");

async function checkIfUserInDB(id) {
    const users = await DButils.execQuery("SELECT userName, password FROM dbo.users");
    var toReturn= users.find((x) => x.user_id === id)
    return toReturn;
}

async function checkIfUserInUsersAndRecipesTable(userName) {
    const users = await DButils.execQuery("SELECT username FROM dbo.UsersAndRecieps");
    var toReturn= users.find((x) => x.username === userName)
    return toReturn;
}

exports.checkIfUserInDB=checkIfUserInDB;