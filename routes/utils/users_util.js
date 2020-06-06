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
    return jsonWithoutInstructions;
}

async function extractData_full(recipes_Info, username){
    // let ingrediants = await getOnlyIngrediants(username);
    let recipeId;
    let recipeTitle;
    let recipeTime;
    let recipeVegiterian;
    let recipeVegan;
    let recipeGlutenFree;
    let recipeImage;
    let recipeInstructions;
    let recipeNumOfMeals;
    let arrayToReturn = [];
    for(var i=0;i<recipes_Info.length;i++){
            recipeId = recipes_Info[i].recipeId;
            recipeTitle = recipes_Info[i].recipeTitle;
            recipeTime = recipes_Info[i].recipeTime;
            recipeVegiterian = recipes_Info[i].recipeVegiterian;
            recipeVegan = recipes_Info[i].recipeVegan;
            recipeGlutenFree = recipes_Info[i].recipeGlutenFree;
            recipeImage = recipes_Info[i].recipeImage;
            recipeInstructions = recipes_Info[i].recipeInstructions;
            recipeNumOfMeals = recipes_Info[i].recipeNumOfMeals;

            arrayToReturn.push({
                id: recipeId,
                title: recipeTitle,
                readyInMinutes: recipeTime,
                vegetarian: recipeVegiterian,
                vegan: recipeVegan,
                glutenFree: recipeGlutenFree,
                image: recipeImage,
                Ingredients: await getOnlyIngrediants(username,recipeId),
                instructions: recipeInstructions, 
                servings: recipeNumOfMeals 
            });
    }
    return arrayToReturn;
     
    }

//     return recipes_Info.map((recipe_info) => {
//         const {
//             recipeId,
//             recipeTitle,
//             recipeTime,
//             recipeVegiterian,
//             recipeVegan,
//             recipeGlutenFree,
//             recipeImage,
//             recipeInstructions, 
//             recipeNumOfMeals
//         } = recipe_info;
//         let ingrediants = await getOnlyIngrediants(username);
//         return {
//             id: recipeId,
//             title: recipeTitle,
//             readyInMinutes: recipeTime,
//             vegetarian: recipeVegiterian,
//             vegan: recipeVegan,
//             glutenFree: recipeGlutenFree,
//             image: recipeImage,
//             Ingredients: ingrediants,
//             instructions: recipeInstructions, 
//             servings: recipeNumOfMeals 
//         };
//     });
// }

async function getOnlyIngrediants(username, recipeId){
    const myRecipesIngrediants= await DButils.execQuery(`SELECT * FROM dbo.personalRecipesIngredients WHERE username='${username}' AND recipeId='${recipeId}'`);
    let allIngerdiantsArray = [];
    for(var i=0; i<myRecipesIngrediants.length; i++){
        allIngerdiantsArray.push({
            name_and_amount: myRecipesIngrediants[i].recipeIngrediant
        });
    }
    console.log("i will return ingrediants array:");
    console.log(allIngerdiantsArray);
    return allIngerdiantsArray;
}




exports.getMyFavoriteRecipes=getMyFavoriteRecipes;
exports.getLastThreeRecipes=getLastThreeRecipes;
exports.getMyRecipes_preview=getMyRecipes_preview;
exports.getMyRecipes_full=getMyRecipes_full;
exports.getUserInfoOnRecipes=getUserInfoOnRecipes;

exports.checkIfUserInDB=checkIfUserInDB;
exports.checkIfUserInUsersAndRecipesTable=checkIfUserInUsersAndRecipesTable;