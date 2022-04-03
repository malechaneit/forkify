import View from './View';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `No recipes found for your query. Please try again!`;

  _generateMarkupPreview(results) {
    return `
        <li class="preview">
            <a class="preview__link" href="#${results.id}">
              <figure class="preview__fig">
                <img src="${results.image}" alt="${results.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${results.title}</h4>
                <p class="preview__publisher">${results.publisher}</p>
              </div>
            </a>
          </li>
    `;
  }

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }
}

export const resultsView = new ResultsView();
