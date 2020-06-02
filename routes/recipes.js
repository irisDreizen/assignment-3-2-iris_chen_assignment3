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
const search_util = require("./utils/search_util");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

router.get("/searchRecipes/query/:searchQuery/:numOfResults", (req, res) => {
    //Gal
    const{ searchQuery, numOfResults } = req.params;
    search_params = {};
    search_params.Query = searchQuery;
    search_params.number = numOfResults;
    search_params.instructionsRequired = true;
    search_util.extractQureryParams(search_params);

    search_util.searchForRecipes(search_params)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
        res.sendStatus(500);
    });
});

router.get("/getRandomRecipes/:howMany", (req, res) => {
    //Gal
});

router.get("/getRecipe/:id", (req, res) => {
    //Gal
});



module.exports = router;