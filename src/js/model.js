import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {API_URL, API_KEY, RES_PER_PAGE} from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resPerPage: RES_PER_PAGE,
  },
  bookmarks: []
};

export const createRecipeObject = function(data) {
    const { recipe } = data.data;

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        cookingTime: recipe.cooking_time,
        ...(recipe.key && {key: recipe.key})
    };
}

export const loadRecipe = async function(id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

            state.recipe = createRecipeObject(data);

            console.log(state.recipe);

            if (state.bookmarks.some(bookmark => bookmark.id === id))
                state.recipe.bookmarked = true;
            else state.recipe.bookmarked = false;

    } catch(err) {
        throw error;
    }
}

export const loadSearchResults = async function(query) {
    try {
        state.search.query = `${query}`;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

        state.search.results = data.data.recipes.map(rec => {
            return {
              id: rec.id,
              title: rec.title,
              publisher: rec.publisher,
              image: rec.image_url,
              ...(rec.key && { key: rec.key }),
            };
        })
        state.search.page = 1;

    } catch(err) {
        console.log(err);
    }
}

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resPerPage;
    const end = page * state.search.resPerPage;
    
    return state.search.results.slice(start, end);
}

export const updateServings = function(newServ) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServ) / state.recipe.servings;
    })
    state.recipe.servings = newServ;
}

const persistBookmark = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
    state.bookmarks.push(recipe);
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmark();
}

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}

init();

export const uploadRecipe = async function(newRecipe){
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());
                if(ingArr.length !== 3) 
                    throw new Error('Wrong ingredient format. Please add 3 parameters separeted by coma.')

                const [quantity, unit, description] = ingArr;

                return {quantity : quantity ? +quantity : null, unit, description};
            });

        const recipe = {
            title: newRecipe.title,
            image_url: newRecipe.image,
            source_url: newRecipe.sourceUrl,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        }

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        
        state.recipe = createRecipeObject(data);
        
    } catch(err) {
        throw(err);
    }


}