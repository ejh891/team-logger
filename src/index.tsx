import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { getStore } from './redux/store';
import { defaultState } from './redux/models/state'; 

import NewsFeed from './components/NewsFeed/NewsFeed';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import UserProfile from './components/UserProfile/UserProfile';
import MyProfile from './components/MyProfile/MyProfile';
import CreatePost from './components/CreatePost/CreatePost';

import { observeAuthState, subscribeToPosts, subscribeToUsers } from './redux/actions/actionCreators';

import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';

const store = getStore(defaultState);

store.dispatch(observeAuthState()); // listen for auth-state changes
store.dispatch(subscribeToPosts()); // listen for posts
store.dispatch(subscribeToUsers()); // listen for new users

ReactDOM.render(
  <Provider store={store}>
    <div>
      <ToastContainer position="bottom-center"/>
      <Router>
        <Switch>
          <Route exact={true} path="/" component={NewsFeed} />
          <Route path="/create-post" component={CreatePost} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/users/:id" component={UserProfile} />
          <Route path="/my-profile" component={MyProfile} />
        </Switch>
      </Router>
    </div>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
