import { actionTypes } from './actionTypes';
import { User } from '../models/user';
import { FirebaseError } from '../models/firebaseError';
import { Profile } from '../models/profile';
import { RatifiedPostBody } from '../models/postBody';

/**********************************************************************************************************************
 * AnyAction - declare the union of all possible action types so that the reducer knows what it can handle
 **********************************************************************************************************************/
export type AnyAction = 
  SetUserSuccessAction |
  SetUserErrorAction |
  ClearSetUserErrorAction |
  CreateUserErrorAction |
  ClearCreateUserErrorAction |
  SetUserAuthStateChangingAction |
  UpdateUserProfileSuccessAction |
  SetPostsSuccessAction |
  SetUsersSuccessAction;

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

export interface ClearSetUserErrorAction {
  type: actionTypes.CLEAR_SET_USER_ERROR;
}

export interface CreateUserErrorAction {
  type: actionTypes.CREATE_USER_ERROR;
  error: FirebaseError;
}

export interface ClearCreateUserErrorAction {
  type: actionTypes.CLEAR_CREATE_USER_ERROR;
}

export interface SetUserAuthStateChangingAction {
  type: actionTypes.SET_USER_AUTH_STATE_CHANGING;
  userAuthStateChanging: boolean;
}

export interface UpdateUserProfileSuccessAction {
  type: actionTypes.UPDATE_USER_PROFILE_SUCCESS;
  profile: Profile;
}

export interface SetPostsSuccessAction {
  type: actionTypes.SET_POSTS_SUCCESS;
  posts: RatifiedPostBody[];
}

export interface SetUsersSuccessAction {
  type: actionTypes.SET_USERS_SUCCESS;
  users: {[key: string]: User};
}
