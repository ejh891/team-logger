import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { State } from './models/state';
import rootReducer from './reducer';

const enhancers = composeWithDevTools(
  applyMiddleware(thunk),
);

let store: Store<State | undefined>;

export function getStore(initialState: State) {
    if (!store) {
        store = createStore(rootReducer, initialState, enhancers);	
    }

    return store;
}