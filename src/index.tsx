import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';

import './index.css';
import { getStore } from './redux/store';
import { defaultState } from './redux/models/state'; 

const store = getStore(defaultState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
