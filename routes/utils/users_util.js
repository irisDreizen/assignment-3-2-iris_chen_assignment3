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

var search_util = require("./search_recipes")
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
    const users = await DButils.execQuery("SELECT * FROM dbo.UsersAndRecieps");
    var toReturn= users.find((x) => x.username === userName)
    return toReturn;
}

async function getLastThreeRecipes(username){
    const LastThreeRecipes= await DButils.execQuery(`SELECT TOP 3  recipeId FROM dbo.UsersHistoryRecieps WHERE username='${username}'`);
    // const recipes=await search_util.getRecipesInfo(LastThreeRecipes);
    return recipes;


}
exports.getLastThreeRecipes=getLastThreeRecipes;

exports.getUserInfoOnRecipes=getUserInfoOnRecipes;

exports.checkIfUserInDB=checkIfUserInDB;
exports.checkIfUserInUsersAndRecipesTable=checkIfUserInUsersAndRecipesTable;