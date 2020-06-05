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
    const users = await DButils.execQuery("SELECT user_id FROM dbo.Users");
    var exist= users.find((x) => x.user_id === id)
    if(exist){
        var user= await DButils.execQuery(`SELECT * FROM dbo.Users WHERE user_id = '${id}'`) ;
        return user;
    }
    return null;
}


async function getUserInfoOnRecipes(user_name, ids){// access DB `SELECT username FROM dbo.Users WHERE user_id = '${id}'`
    var data={};
    for(var i=0; i<ids.length; i++){
        var userData = await DButils.execQuery(`SELECT watched,saveFavorites FROM dbo.UsersAndRecieps WHERE username='${user_name}' and recipeId='${ids[i]}'`);
        data[ids[i]]=[];
        data[ids[i]].push(userData[0].watched);
        data[ids[i]].push(userData[0].saveFavorites);

    }
    return data;

}

async function checkIfUserInUsersAndRecipesTable(userName) {
    const users = await DButils.execQuery("SELECT username FROM dbo.UsersAndRecieps");
    var toReturn= users.find((x) => x.username === userName)
    return toReturn;
}

exports.getUserInfoOnRecipes=getUserInfoOnRecipes;

exports.checkIfUserInDB=checkIfUserInDB;