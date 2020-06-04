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

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

router.use((req, res, next) => {
    if(req.session && req.session.id){
        const id = req.session.id;
        const user = checkIfUserInDB(id);

        if(user){
            req.user = user;
            next();
        }
    }
    res.sendStatus(401);
});

router.get("/recipeInfo/{ids}", (req,res) => {//chen
    const ids =JSON.parse( req.params.ids);
    const user_name = req.user;
    console.log(ids,user_name);
    const userRecipesData= getUserInfoOnRecipes(user_name, ids);//returns if the user watch or save on the recipe id
    res.send(userRecipesData);
});

async function getUserInfoOnRecipes(user_name, ids){// access DB

}




router.get('/threeLastRecipes', (req, res) => {//chen

});


router.get('/myFavorites', (req, res) => {//chen

});

router.get('/myRecepies', (req, res) => {//chen

});

router.post('/addNewRecipeToFavorites', (req, res) => {//chen

});










async function checkIfUserInDB() {
    const users = await DButils.execQuery("SELECT userName, password FROM dbo.users");
    var toReturn= users.find((x) => x.userName === id)
    return toReturn;
}

module.exports = router;