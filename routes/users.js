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
let recordSerialNumber=0;
var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

router.use(async(req, res, next) => {
    if(req.session && req.session.id){
        const id = req.session.id;
        const user =  await users_util.checkIfUserInDB(id);
        if(user){
             req.user = user;
            next();
        }
    }
    else {res.sendStatus(401);}
});



router.get("/recipeInfo/:ids", async(req,res) => {//chen
    const ids =JSON.parse( req.params.ids);
    const user_name = req.user[0].username;
    // console.log(ids,user_name);
    const userRecipesData= await users_util.getUserInfoOnRecipes(user_name, ids);//returns if the user watch or save on the recipe id
    res.status(200).send(userRecipesData);
});






router.get('/threeLastRecipes', async(req, res) => {//chen
    var arrayLastThreeRecipes=await users_util.getLastThreeRecipes(req.user[0].username);

    res.send(arrayLastThreeRecipes);

});


router.get('/myFavorites', (req, res) => {//chen

});

router.get('/myRecepies', (req, res) => {//chen

});

router.post('/addNewRecipeToFavorites',async (req, res) => {//chen

    let answer =await users_util.checkIfUserInUsersAndRecipesTable(req.user[0].username);
    if(answer){
        let users = await DButils.execQuery(`UPDATE dbo.UsersAndRecieps SET saveFavorites=1 WHERE username='${req.user[0].username}'`);
        res.send("updated user");    
    }
    else{
        // recordSerialNumber=recordSerialNumber+1;
        let users = await DButils.execQuery(`INSERT INTO dbo.UsersAndRecieps (username, recipeId, watched, saveFavorites) VALUES ('${req.user[0].username}','${req.body.id}','0','1')`);
        res.send("inserted user") 
    }


});







router.post('/addNewRecipeToWatched',async (req, res) => {//chen
    let answer = await users_util.checkIfUserInUsersAndRecipesTable(req.user[0].username)
    if(answer){
        let users = await DButils.execQuery(`UPDATE dbo.UsersAndRecieps SET watched=1 WHERE username='${req.user[0].username}'`);
        res.send("updated user");    
    }
    else{
        recordSerialNumber=recordSerialNumber+1;
        let users = await DButils.execQuery(`INSER INTO dbo.UsersAndRecieps (username, recipeId, watched, saveFavorites) VALUES ('${req.user[0].username}','${req.body.id}','0','1')`);
        res.send("inserted new user") 
    }

});


// async function checkIfUserInDB() {
//     const users = await DButils.execQuery("SELECT userName, password FROM dbo.users");
//     var toReturn= users.find((x) => x.userName === id)
//     return toReturn;
// }

module.exports = router;