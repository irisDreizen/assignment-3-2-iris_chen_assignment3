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

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json


router.get("/search/query/:searchQuery/amount/:num", (req, res) => {//iris
    //Gal
    const{ searchQuery, num } = req.params;
    search_params = {};
    search_params.Query = searchQuery;
    search_params.number = num;
    search_params.instructionsRequired = true;
    search_util.extractQureryParams(req.query,search_params);

    search_util.searchForRecipes(search_params)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
        res.sendStatus(500);
    });
});


router.get('/:recipeID', (req, res) => {//iris

});

router.get('/:threeRandomRecepies', (req, res) => {//iris

});





module.exports = router;