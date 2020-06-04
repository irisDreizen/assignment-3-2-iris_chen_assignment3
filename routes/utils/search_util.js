const axios = require("axios");
const api_url = "https://api.spoonacular.com/recipes";
const api_key = "apiKey=570f1120b25b4810b76edcbba14a0fb7";


function extractQureryParams(query_params, search_params){
    const params_list = ["diet","cuisine","intolerence"];
    params_list.forEach((param) => {
        if(query_params[param]){
            search_params[param] = query_params[param];
        }
    });
}

async function searchForRecipes(search_params){
    let search_response = await axios.get(
        `${api_url}/search?${api_key}`,
        {
            params: search_params,
        }
    );
    const recipes_id_list = extractSearchResultsIds(search_response);
    let info_array = await getRecipesInfo(recipes_id_list);
    return info_array;
}

async function getRecipesInfo(recipes_id_list){
    let promises = [];
    recipes_id_list.map((id) => 
    promises.push(axios.get(`${api_url}/${id}/info?${api_key}`))
    );
    let info_response1 = await Promise.all(promises);
    relevantRecipes = extracRelevantRecepiesData(info_response1);
    return relevantRecipes;
}

function extractSearchResultsIds(search_response){
    let recipes = search_response.data.results;
    recipes_id_list = [];
    recipes((recipe) => {
        recipes_id_list.push(recipe.id);
    });
    return recipes_id_list;
}

function extracRelevantRecepiesData(recipes_Info){
    return recipes_Info.map((recipe_info) => {
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
        } = recipe_info.data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
        };
    });
}

exports.extractQureryParams = extractQureryParams;
exports.searchForRecipes = searchForRecipes;