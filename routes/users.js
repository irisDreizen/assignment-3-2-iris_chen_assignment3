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

router.use((req, res, next) => {
    if(req.session && req.session.id){
        const id = req.session.id;
        const user = checkIdOnDb(id);

        if(user){
            req.user = user;
            next();
        }
    }
    res.sendStatus(401);
});

router.get("/recipeInfo/{ids}", (req,res) => {
    const ids =JSON.parse( req.params.ids);
    const user_name = req.user;
    console.log(ids,user_name);
    const userRecipesData= getUserInfoOnRecipes(user_name, ids);//returns if the user watch or save on the recipe id
    res.send(userRecipesData);
});

router.get('/getMyFavorite', (req, res) => {
//Alon - Get (Maybe to get from added recipes)
//Gal - Get from API
});

router.post('/addRecipeToFavorites', (req, res) => {
//Alon
});

router.post('/addRecipeToWatched', (req, res) => {
//Alon
});


router.get('/getMyRecepies', (req, res) => {
//Alon
});

router.get('/getMyFamilyRecepies', (req, res) => {
//Alon
});

router.post("/addRecipe", (req, res) => {
    //add to DB
    //check if logged in (cookie?)
});

router.post("/addRecipeToFamilyRecipes", (req, res) => {
//Alon
});

router.get('/getLastWatchedRecipes', (req, res) => {
//Alon - add to DB
//Gal - Get from API
});


async function checkIdOnDb(id) {
    const users = await DButils.execQuery("SELECT userName, password FROM dbo.users");
    return users.find((x) => x.userName === id);
}

module.exports = router;