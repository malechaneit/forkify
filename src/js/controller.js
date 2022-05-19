import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { recipeView, addHandlerRender } from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';

if(module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // 0. Update the recipe view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1. Loading recipe
    recipeView.renderSpinner();

    await model.loadRecipe(id);

    const { recipe } = model.state;

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);

    // 3. Update bookmarks
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

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try{

    addRecipeView.renderSpinner();

    // Update the API
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Show success message
    addRecipeView.renderMessage();

    // Add recipe to bookmarks immediatly
    model.addBookmark(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    // Close modal
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch(err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  } 
}

const init = function() {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarksView.addHandlerBookmark(controlBookmarks);
  searchView.addHandlerEvent(controlSearchResults);
  paginationView.addPageEventHandler(controlPagination);
  addRecipeView.uploadHandler(controlAddRecipe);
}

init();
