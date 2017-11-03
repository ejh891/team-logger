/*
  Here we are following a pattern found at https://spin.atomicobject.com/2017/07/24/redux-action-pattern-typescript/
  We utilize an "AnyAction" which OR's together all of our possible action interfaces. Then we create an enum that
  describes all of our possible action types (1 actionType per action interface). Our reducer will accept an action of
  type: AnyAction and will switch on the actionTypes enum. Inside the reducer, TypeScript is intelligent enough to use
  the enum to infer the EXACT action interface that we're referring to. So, rather than just being happy with the
  declaration of AnyAction in our reducer, we'll get proper typechecking in each different case in the switch statement
  without having to cast the AnyAction to the exact action that we are handling.
*/

import { Dispatch, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { State } from './models/state';
import { User } from './models/user';

import { firebaseAuth, firebaseFacebookAuthProvider } from '../firebase/firebaseProvider';

export type AnyAction = 
  SetUserAction |
  SetUserAuthStateChangingAction;

export enum actionTypes {
  SET_USER = 'SET_USER',
  SET_USER_AUTH_STATE_CHANGING = 'SET_USER_AUTH_STATE_CHANGING',

  // system action is never dispatched, but it forces us to add a default case to our reducers
  // this is important so that redux and middleware can dispatch their own actions and we'll handle it gracefully
  DEFAULT_ACTION = 'DEFAULT_ACTION',
}

export interface SetUserAction {
  type: actionTypes.SET_USER;
  user: User;
}

export interface SetUserAuthStateChangingAction {
  type: actionTypes.SET_USER_AUTH_STATE_CHANGING;
  userAuthStateChanging: boolean;
}

export const setUser: ActionCreator<SetUserAction> = 
  (user: User) => {
    return {
      type: actionTypes.SET_USER,
      user
    };
  };

export const setUserAuthStateChanging: ActionCreator<SetUserAuthStateChangingAction> = 
  (userAuthStateChanging: boolean) => {
    return {
      type: actionTypes.SET_USER_AUTH_STATE_CHANGING,
      userAuthStateChanging
    };
  };

export const observeAuthState: ActionCreator<ThunkAction<void, State, void>> =
  () => {
    return (dispatch: Dispatch<State>) => {
      firebaseAuth().onAuthStateChanged((user) => {
        if (user) {
          dispatch(setUser({id: user.uid, name: user.displayName, photoURL: user.photoURL}));
        } else {
          dispatch(setUser(null));
        }
      
        dispatch(setUserAuthStateChanging(false));
      });
    };
  };

export const logInUser: ActionCreator<ThunkAction<void, State, void>> =
  () => {
      return (dispatch: Dispatch<State>) => {
        dispatch(setUserAuthStateChanging(true));

        firebaseAuth().signInWithPopup(firebaseFacebookAuthProvider);
      };
  };

export const logOutUser: ActionCreator<ThunkAction<void, State, void>> =
  () => {
    return (dispatch: Dispatch<State>) => {
        dispatch(setUserAuthStateChanging(true));

        firebaseAuth().signOut();
    };
  };
