import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
    _parentEl = document.querySelector('.pagination');

    addPageEventHandler(handler) {
        this._parentEl.addEventListener('click', function (e) {
          const btn = e.target.closest('.btn--inline');
          if(!btn) return;
          const goto = +btn.dataset.goto;
        
          handler(goto);
        });
    }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resPerPage
    );
    const curPage = this._data.page;

    if (curPage === 1 && numPages > 1) {
      // First page but there are other
      return `
            <button  data-goto="${
              curPage + 1
            }"class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
    }

    // Other page
    if (curPage < numPages) {
      return `
            <button data-goto="${curPage - 1}" 
                class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
          </button>
          <button data-goto="${
            curPage + 1
          }" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
          </button>
        `;
    }

    //Last page
    if (curPage === numPages && curPage > 1) {
      return `
            <button  data-goto="${
              curPage - 1
            }"class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>`;
    }

    // Only one page or no pages
    return '';
  }
}

export default new PaginationView();
