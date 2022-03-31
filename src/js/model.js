import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {API_URL} from './config.js';
import { getJSON } from './helpers.js';

export const state = {
    recipe: {

    }
}

export const loadRecipe = async function(id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`);

        const {recipe} = data.data;

        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            cookingTime: recipe.cooking_time
            }

    } catch(err) {
        console.error(`My model error: ${err}`);
    }
}