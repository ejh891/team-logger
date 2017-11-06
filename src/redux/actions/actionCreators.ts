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

import { actionTypes } from './actionTypes';
import * as actions from './actions';

import { State } from '../models/state';
import { User } from '../models/user';
import { FirebaseError } from '../models/firebaseError';
import { PostBody } from '../models/postBody';
import { Profile } from '../models/profile';

import { firebaseAuth, firebaseFacebookAuthProvider, firebaseDatabase } from '../../firebase/firebaseProvider';
import { authErrorCodes } from '../../enums/authErrorCodes';

const defaultAvatarSrc = require('../../images/logo.png');

/**********************************************************************************************************************
 * ActionCreators - define functions that create actions
 **********************************************************************************************************************/

 // saves the user's info in our db so that the info is available for querying
function _saveUser(user: {id: string, name: string | null, photoURL: string | null}) {
  const name = user.name || 'Unidentified Poo-Boy';
  const photoURL = user.photoURL || defaultAvatarSrc;

  firebaseDatabase().ref(`users/${user.id}`).set({ id: user.id, name, photoURL });
}

export const setUserSuccess: ActionCreator<actions.SetUserSuccessAction> = 
  (user: User) => {
    if (user !== null) {
      _saveUser(user);
    }
    
    return {
      type: actionTypes.SET_USER_SUCCESS,
      user
    };
  };

export const setUserError: ActionCreator<actions.SetUserErrorAction> = 
  (error: FirebaseError) => {
    return {
      type: actionTypes.SET_USER_ERROR,
      error
    };
  };

export const clearSetUserError: ActionCreator<actions.ClearSetUserErrorAction> = 
  () => {
    return {
      type: actionTypes.CLEAR_SET_USER_ERROR,
      error: null
    };
  };

export const createUserError: ActionCreator<actions.CreateUserErrorAction> = 
  (error: FirebaseError) => {
    return {
      type: actionTypes.CREATE_USER_ERROR,
      error
    };
  };

export const clearCreateUserError: ActionCreator<actions.ClearCreateUserErrorAction> = 
  () => {
    return {
      type: actionTypes.CLEAR_CREATE_USER_ERROR,
      error: null
    };
  };

export const setUserAuthStateChanging: ActionCreator<actions.SetUserAuthStateChangingAction> = 
  (userAuthStateChanging: boolean) => {
    return {
      type: actionTypes.SET_USER_AUTH_STATE_CHANGING,
      userAuthStateChanging
    };
  };

export const updateUserProfileSuccess: ActionCreator<actions.UpdateUserProfileSuccessAction> = 
  (profile: Profile) => {    
    return {
      type: actionTypes.UPDATE_USER_PROFILE_SUCCESS,
      profile
    };
  };

export const setPostsSuccess: ActionCreator<actions.SetPostsSuccessAction> = 
  (posts: PostBody[]) => {    
    return {
      type: actionTypes.SET_POSTS_SUCCESS,
      posts
    };
  };

export const setUsersSuccess: ActionCreator<actions.SetUsersSuccessAction> = 
  (users: {[key: string]: User}) => {    
    return {
      type: actionTypes.SET_USERS_SUCCESS,
      users
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

export const subscribeToPosts: ActionCreator<ThunkAction<void, State, void>> =
  () => {
    return (dispatch: Dispatch<State>) => {
      const postsRef = firebaseDatabase().ref('posts');
      
      postsRef.on('value', (snapshot) => {
        if (snapshot === null) { return; }
        
        const postMap = snapshot.val();

        const posts = [];
        for (let postId in postMap) {
          if (postMap.hasOwnProperty(postId)) {
            posts.unshift(postMap[postId]);
          }
        }

        dispatch(setPostsSuccess(posts));
      });
    };
  };

export const subscribeToUsers: ActionCreator<ThunkAction<void, State, void>> =
  () => {
    return (dispatch: Dispatch<State>) => {
      const postsRef = firebaseDatabase().ref('users');
      
      postsRef.on('value', (snapshot) => {
        if (snapshot === null) { return; }
        
        const userMap = snapshot.val();

        dispatch(setUsersSuccess(userMap));
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
          
          dispatch(createUserError({ code: errorCode, message: errorMessage }));
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
            toast.success('Email sent!');
          })
          .catch(function(error: FirebaseError) {
            toast.error('Whoops! ' + error.message);
          });
      };
    };

export const updateUserProfile: ActionCreator<ThunkAction<void, State, void>> =
    (profile: Profile) => {
      return (dispatch: Dispatch<State>) => {
        const firebaseUser = firebaseAuth().currentUser;
        
        if (firebaseUser === null) {
          toast.error('Whoops! Null ref, bro'); // todo: better error message
        } else {
          firebaseUser.updateProfile({
            displayName: profile.name,
            photoURL: profile.photoURL
          }).then(function() {
            const user = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL
            };

            _saveUser(user);

            dispatch(updateUserProfileSuccess(profile));
            toast.success('Poofile has been updated');
          }).catch(function(error: Error) {
            toast.error('Whoops! ' + error.message);
          });
        }
      };
    };

export const submitPost: ActionCreator<ThunkAction<void, State, void>> =
  (post: PostBody) => {
    return (dispatch: Dispatch<State>) => {
      firebaseDatabase().ref(`posts`).push(post);
    };        
  };
