import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { getStore } from './redux/store';
import { defaultState } from './redux/models/state'; 

import App from './components/App/App';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import User from './components/User/User';
import MyProfile from './components/MyProfile/MyProfile';
import { observeAuthState } from './redux/actions';

import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';

const store = getStore(defaultState);

store.dispatch(observeAuthState()); // listen for auth-state changes

ReactDOM.render(
  <Provider store={store}>
    <div>
      <ToastContainer position="bottom-right"/>
      <Router>
        <Switch>
          <Route exact={true} path="/" component={App} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/users/:id" component={User} />
          <Route path="/my-profile" component={MyProfile} />
        </Switch>
      </Router>
    </div>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
