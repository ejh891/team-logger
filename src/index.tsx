import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { getStore } from './redux/store';
import { defaultState } from './redux/models/state'; 

import App from './components/App/App';
import Auth from './components/Auth/Auth';
import User from './components/User/User';

import './index.css';

const store = getStore(defaultState);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact={true} path="/" component={App} />
        <Route path="/sign-in" component={Auth} />
        <Route path="/users/:id" component={User} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
