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
    var recipeToReturn=[];
    const LastThreeRecipes1= await DButils.execQuery(`SELECT recipeId, username FROM dbo.UsersHistoryRecieps ORDER BY serialNumber DESC`);
    const userLastRecipe=LastThreeRecipes1.filter((x) => x.username === username);
    for(var i=0; i<3; i++){
        recipeToReturn.push(userLastRecipe[i].recipeId);

    }

    return recipeToReturn;


}
async function getMyFavoriteRecipes(username){
    const myFavorites= await DButils.execQuery(`SELECT recipeId FROM dbo.UsersAndRecieps WHERE username='${username}' and saveFavorites='1'`);
    return myFavorites;

}

async function getMyRecipes_preview(username){
    const myRecipes= await DButils.execQuery(`SELECT * FROM dbo.personalRecipes WHERE username='${username}'`);
    return extractData_preview(myRecipes);
}

function extractData_preview(recipes_Info){
    return recipes_Info.map((recipe_info) => {
        const {
            recipeId,
            recipeTitle,
            recipeTime,
            recipeVegiterian,
            recipeVegan,
            recipeGlutenFree,
            recipeImage,
        } = recipe_info;
        return {
            id: recipeId,
            title: recipeTitle,
            readyInMinutes: recipeTime,
            vegetarian: recipeVegiterian,
            vegan: recipeVegan,
            glutenFree: recipeGlutenFree,
            image: recipeImage,
        };
    });
}


async function getMyRecipes_full(username){
    const myRecipes= await DButils.execQuery(`SELECT * FROM dbo.personalRecipes WHERE username='${username}'`);
    const jsonWithoutInstructions =extractData_full(myRecipes,username);
}

function extractData_full(recipes_Info, username){
    return recipes_Info.map((recipe_info) => {
        const {
            recipeId,
            recipeTitle,
            recipeTime,
            recipeVegiterian,
            recipeVegan,
            recipeGlutenFree,
            recipeImage,
            recipeInstructions, 
            recipeNumOfMeals
        } = recipe_info;
        return {
            id: recipeId,
            title: recipeTitle,
            readyInMinutes: recipeTime,
            vegetarian: recipeVegiterian,
            vegan: recipeVegan,
            glutenFree: recipeGlutenFree,
            image: recipeImage,
            Ingredients:getOnlyIngrediants(username) ,
            instructions: recipeInstructions, 
            servings: recipeNumOfMeals 
        };
    });
}

function getOnlyIngrediants(username){
    const myRecipesIngrediants= await DButils.execQuery(`SELECT * FROM dbo.personalRecipesIngredients WHERE username='${username}'`);
    return myRecipesIngrediants.map((ingrediant_info) => {
        const {
            recipeIngrediant,
        } = ingrediant_info;


        return {
            name_and_amount: recipeIngrediant,
        };
    });
}




exports.getMyFavoriteRecipes=getMyFavoriteRecipes;
exports.getLastThreeRecipes=getLastThreeRecipes;
exports.getMyRecipes_preview=getMyRecipes_preview;
exports.getMyRecipes_full=getMyRecipes_full;
exports.getUserInfoOnRecipes=getUserInfoOnRecipes;

exports.checkIfUserInDB=checkIfUserInDB;
exports.checkIfUserInUsersAndRecipesTable=checkIfUserInUsersAndRecipesTable;