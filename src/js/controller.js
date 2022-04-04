import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { recipeView, addHandlerRender } from './view/recipeView.js';
import { searchView } from './view/searchView.js';
import { resultsView } from './view/resultsView.js';
import { paginationView } from './view/paginationView.js';

if(module.hot) {
  module.hot.accept();
}

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

const controlSearchResults = async function() {
  try {
    const query = searchView.getQuery();
    if(!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);
    console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
    
  } catch(err) {
    console.log(err);
  }
}

const controlPagination = function(goto) {
  resultsView.render(model.getSearchResultsPage(goto));
  paginationView.render(model.state.search);
}

const controlServings = function(newServ) {
  model.updateServings(newServ);

  recipeView.render(model.state.recipe);
}


const init = function() {
  recipeView.addHandlerRender(showRecipe);
  searchView.addHandlerEvent(controlSearchResults);
  paginationView.addPageEventHandler(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
}

init();
