import { previewView } from './previewView';
import View from './View';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `No recipes found for your query. Please try again!`;
  _message = '';

  _generateMarkup() {
    return this._data
        .map(result => previewView.render(result, false))
        .join('');
  }
}

export const resultsView = new ResultsView();
