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
const users_util = require("./utils/users_util");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

router.use((req, res, next) => {
    if(req.session && req.session.id){
        const id = req.session.id;
        const user =  users_util.checkIfUserInDB(id);

        if(user){
             req.user = user;
            next();
        }
    }
    else {res.sendStatus(401);}
});

// router.use(async (req, res, next) => {
//     if (req.session && req.session.id) {
//       //const id = req.session.id;
//       const user = (
//         await DButils.execQuery(
//           `SELECT * FROM dbo.users WHERE user_id = '${req.session.id}'`
//         )
//       )[0];
//       if (user) {
//         req.user = user;
//         next();
//       }
//     }
//     else res.sendStatus(401);
//   });

router.get("/alive", (req, res) => {
    res.send("ok");
});

router.get("/recipeInfo/:ids", async(req,res) => {//chen
    const ids =JSON.parse( req.params.ids);
    const user_name = req.username;
    console.log(ids,user_name);
    const userRecipesData= await users_util.getUserInfoOnRecipes(user_name, ids);//returns if the user watch or save on the recipe id
    res.send(userRecipesData);
});






router.get('/threeLastRecipes', (req, res) => {//chen

});


router.get('/myFavorites', (req, res) => {//chen

});

router.get('/myRecepies', (req, res) => {//chen

});

router.post('/addNewRecipeToFavorites', (req, res) => {//chen
    if(users_util.checkIfUserInUsersAndRecipesTable(req.user.username)){
        let users = await DButils.execQuery(`UPDATE db.UserAndRecieps SET saveFavorites=1 WHERE username=${req.user.username}`);
        return users;    
    }

});










async function checkIfUserInDB() {
    const users = await DButils.execQuery("SELECT userName, password FROM dbo.users");
    var toReturn= users.find((x) => x.userName === id)
    return toReturn;
}

module.exports = router;