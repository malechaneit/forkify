import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { recipeView, addHandlerRender } from './view/recipeView.js';
import { searchView } from './view/searchView.js';
import { resultsView } from './view/resultsView.js';
import { paginationView } from './view/paginationView.js';
import { bookmarksView } from './view/bookmarksView.js'

if(module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    resultsView.update(model.getSearchResultsPage());

    // 1. Loading recipe

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    const { recipe } = model.state;

    // 2. Rendering recipe

    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
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
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  // 1. Add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
    
  // 2. Update recipe
  recipeView.update(model.state.recipe);

  // 3. Update bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const init = function() {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerEvent(controlSearchResults);
  paginationView.addPageEventHandler(controlPagination);
}

init();
