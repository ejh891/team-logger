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
import { toast } from 'react-toastify';

import { State } from './models/state';
import { User } from './models/user';
import { FirebaseError } from './models/firebaseError';
import { Profile } from './models/profile';

import { firebaseAuth, firebaseFacebookAuthProvider } from '../firebase/firebaseProvider';
import { authErrorCodes } from '../enums/authErrorCodes';

/**********************************************************************************************************************
 * AnyAction - declare the union of all possible action types so that the reducer knows what it can handle
 **********************************************************************************************************************/
export type AnyAction = 
  SetUserSuccessAction |
  SetUserErrorAction |
  SetUserAuthStateChangingAction |
  UpdateUserProfileSuccessAction;

/**********************************************************************************************************************
 * ActionTypes - declare all of the possible action types so that the reducer can Switch across them
 **********************************************************************************************************************/
export enum actionTypes {
  SET_USER_SUCCESS = 'SET_USER_SUCCESS',
  SET_USER_ERROR = 'SET_USER_ERROR',
  SET_USER_AUTH_STATE_CHANGING = 'SET_USER_AUTH_STATE_CHANGING',
  UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS',

  // system action is never dispatched, but it forces us to add a default case to our reducers
  // this is important so that redux and middleware can dispatch their own actions and we'll handle it gracefully
  DEFAULT_ACTION = 'DEFAULT_ACTION',
}

/**********************************************************************************************************************
 * ActionInterfaces - declare actionType and payloads for each action
 **********************************************************************************************************************/
export interface SetUserSuccessAction {
  type: actionTypes.SET_USER_SUCCESS;
  user: User;
}

export interface SetUserErrorAction {
  type: actionTypes.SET_USER_ERROR;
  error: FirebaseError;
}

export interface SetUserAuthStateChangingAction {
  type: actionTypes.SET_USER_AUTH_STATE_CHANGING;
  userAuthStateChanging: boolean;
}

export interface UpdateUserProfileSuccessAction {
  type: actionTypes.UPDATE_USER_PROFILE_SUCCESS;
  profile: Profile;
}

/**********************************************************************************************************************
 * ActionCreators - define functions that create actions
 **********************************************************************************************************************/

export const setUserSuccess: ActionCreator<SetUserSuccessAction> = 
  (user: User) => {
    return {
      type: actionTypes.SET_USER_SUCCESS,
      user
    };
  };

export const setUserError: ActionCreator<SetUserErrorAction> = 
  (error: FirebaseError) => {
    return {
      type: actionTypes.SET_USER_ERROR,
      error
    };
  };

export const setUserAuthStateChanging: ActionCreator<SetUserAuthStateChangingAction> = 
  (userAuthStateChanging: boolean) => {
    return {
      type: actionTypes.SET_USER_AUTH_STATE_CHANGING,
      userAuthStateChanging
    };
  };

export const updateUserProfileSuccess: ActionCreator<UpdateUserProfileSuccessAction> = 
  (profile: Profile) => {
    return {
      type: actionTypes.UPDATE_USER_PROFILE_SUCCESS,
      profile
    };
  };

/**********************************************************************************************************************
 * ThunkActions - actions which typically dispatch a normal action as a response to some async call
 **********************************************************************************************************************/
export const observeAuthState: ActionCreator<ThunkAction<void, State, void>> =
  () => {
    return (dispatch: Dispatch<State>) => {
      firebaseAuth().onAuthStateChanged((user) => {
        if (user) {
          dispatch(setUserSuccess({id: user.uid, name: user.displayName, photoURL: user.photoURL}));
        } else {
          dispatch(setUserSuccess(null));
        }
      
        dispatch(setUserAuthStateChanging(false));
      });
    };
  };

export const logInUserViaFacebook: ActionCreator<ThunkAction<void, State, void>> =
  () => {
      return (dispatch: Dispatch<State>) => {
        dispatch(setUserAuthStateChanging(true));

        firebaseAuth().signInWithPopup(firebaseFacebookAuthProvider);
      };
  };

export const logInUserViaEmail: ActionCreator<ThunkAction<void, State, void>> =
  (email, password) => {
      return (dispatch: Dispatch<State>) => {
        dispatch(setUserAuthStateChanging(true));

        firebaseAuth().signInWithEmailAndPassword(email, password)
          .catch(function(error: FirebaseError) {
            const errorCode = error.code;
            let errorMessage = error.message;

            switch (errorCode) {
              case authErrorCodes.USER_NOT_FOUND:
                errorMessage = 'Hmm. We couldn\'t find that email.';
                break;
              case authErrorCodes.BAD_PASSWORD:
                errorMessage = 'Hmm. That password doesn\'t look quite right.';
                break;
              default:
                break;
            }

            dispatch(setUserError({ code: errorCode, message: errorMessage }));
        });
      };
  };

export const createUserViaEmail: ActionCreator<ThunkAction<void, State, void>> =
  (email, password) => {
    return (dispatch: Dispatch<State>) => {
      dispatch(setUserAuthStateChanging(true));
      
      firebaseAuth().createUserWithEmailAndPassword(email, password)
        .catch(function(error: FirebaseError) {
          var errorCode = error.code;
          var errorMessage = error.message;
          
          dispatch(setUserError({ code: errorCode, message: errorMessage }));
        });
    };
  };

export const logOutUser: ActionCreator<ThunkAction<void, State, void>> =
  () => {
    return (dispatch: Dispatch<State>) => {
        dispatch(setUserAuthStateChanging(true));

        firebaseAuth().signOut();
    };
  };

export const sendPasswordResetEmail: ActionCreator<ThunkAction<void, State, void>> =
    (email) => {
      return (dispatch: Dispatch<State>) => {
        firebaseAuth().sendPasswordResetEmail(email)
          .then(function() {
            // dispatch(sendPasswordResetEmailSuccess());
            toast.success('Email sent!');
          })
          .catch(function(error: FirebaseError) {
            // dispatch(sendPasswordResetEmailError(error));
            toast.error('Whoops! ' + error.message);
          });
      };
    };

export const updateUserProfile: ActionCreator<ThunkAction<void, State, void>> =
    (profile: Profile) => {
      return (dispatch: Dispatch<State>) => {
        const user = firebaseAuth().currentUser;
        
        if (user === null) {
          // dispatch(updateUserProfileError({
          //   error: 'user-is-null',
          //   message: 'Could not update user because of a null reference'
          // }));
          toast.error('Whoops! Null ref, bro'); // todo: better error message
        } else {
          user.updateProfile({
            displayName: profile.name,
            photoURL: profile.photoURL
          }).then(function() {
            dispatch(updateUserProfileSuccess(profile));
          }).catch(function(error: Error) {
            toast.error('Whoops! ' + error.message);
            // dispatch(updateUserProfileError(error));
          });
        }
      };
    };