var express = require("express");
var router = express.Router();
//#region global imports
require("dotenv").config();
const axios = require("axios");
//#region express configures
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var DButils = require("./utils/DButils")
const search_util = require("./utils/search_recipes");
// const users_util = require("./utils/users_util");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json


router.get("/search/query/:searchQuery/amount/:num", (req, res) => {//iris
    console.log("i'm in search function1");
    const{ searchQuery, num } = req.params;
    search_params = {};
    search_params.Query = searchQuery;
    search_params.number = num;
    search_params.instructionsRequired = true;
    search_util.extractQureryParams(req.query,search_params);
    console.log("i'm in search function5");
    search_util
    .searchForRecipes(search_params)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
        res.sendStatus(500);
    });
});

router.get('/check', (req, res) => {//iris
    res.send("everything is ok");
});

router.get("/threeRandomRecipies", (req, res) => {//iris
    console.log("i'm in function1");
    search_params = {};
    search_params.number = 3;
    search_util
    .searchForRandomRecipes(search_params)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
        res.sendStatus(500);
    });
});

router.get("/getFullRecipe/:recipeID", (req, res) => {//iris
    const{ recipeID } = req.params;
    search_params = {};
    search_params.id = recipeID;

    //
    recipes_id_list = [];
    recipes_id_list.push(search_params.id);
    //

    search_util
    //.searchForRecipesByID(search_params)
    .getRecipesInfo_fullRecipe(recipes_id_list)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
        res.sendStatus(500);
    });
});

router.get("/getRecipePreview/:recipeID", (req, res) => {//iris
    const{ recipeID } = req.params;
    search_params = {};
    search_params.id = recipeID;

    //
    recipes_id_list = [];
    recipes_id_list.push(search_params.id);
    //

    search_util
    //.searchForRecipesByID(search_params)
    .getRecipesInfo(recipes_id_list)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
        res.sendStatus(500);
    });
});




module.exports = router;