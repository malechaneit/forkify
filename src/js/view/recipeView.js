import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView {
  #parentEl = document.querySelector('.recipe');
  #data;
  #markup;
  #errorMessage = `No recipes found for your query. Please try again!`;
  #successMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

  render = function (data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterBegin', markup);
  };

  #clear = function () {
    this.#parentEl.innerHTML = '';
  };

  renderError = function (message = this.#errorMessage) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `;
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderMessage = function (message = this.#successMessage) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderSpinner = function () {
    const markup = `
        <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
        </svg>
        </div>
    `;

    this.#clear();
    this.#parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  #generateIngredientsMarkup = function (ing) {
    return `
        <li class="recipe__ingredient">
        <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
        </div>
        </li>`;
  };

  #generateMarkup = function () {
    return `
      <figure class="recipe__fig">
            <img src="${this.#data.image}" alt="${this.#data.title}" 
            class="recipe__img" />
            <h1 class="recipe__title">
              <span>${this.#data.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                this.#data.cookingTime
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                this.#data.servings
              }</span>
              <span class="recipe__info-text">servings</span>

              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--increase-servings">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>

            <div class="recipe__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            <button class="btn--round">
              <svg class="">
                <use href="${icons}#icon-bookmark-fill"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
              ${this.#data.ingredients
                .map(ing => this.#generateIngredientsMarkup(ing))
                .join('')}
            </ul>
          </div>

          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>
    `;
  };

  addHandlerRender = function (handler) {
    ['load', 'hashchange'].forEach(ev => window.addEventListener(ev, handler));
  };
}

export const recipeView = new RecipeView();
