import icons from 'url:../../img/icons.svg';

export default class View {
  _parentEl = document.querySelector('.recipe');
  _data;

  render = function (data) {
    if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterBegin', markup);
  };

  _clear = function () {
    this._parentEl.innerHTML = '';
  };

  renderError = function (message = this._errorMessage) {
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
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderMessage = function (message = this._successMessage) {
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
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  renderSpinner = function () {
    const markup = `
        <div class="spinner">
        <svg>
            <use href="${icons}_icon-loader"></use>
        </svg>
        </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  };
}
