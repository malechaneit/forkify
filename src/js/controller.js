import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { recipeView, addHandlerRender } from './view/recipeView.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipe = async function () {
  try {
    // 1. Loading recipe

    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    const {recipe} = model.state;

    // 2. Rendering recipe

    recipeView.render(model.state.recipe);
    
  } catch (err) {
    recipeView.renderError();
  }
};

recipeView.addHandlerRender(showRecipe);
