import { User, NullableUser } from './user';
import { NullableFirebaseError } from './firebaseError';
import { RatifiedPostBody } from './postBody';

export interface State {
    user: NullableUser;
    userAuthStateChanging: boolean;
    setUserError: NullableFirebaseError;
    createUserError: NullableFirebaseError;
    posts: RatifiedPostBody[];
    userPosts: RatifiedPostBody[];
    users: {[key: string]: User};
}

export const defaultState: State = {
  user: null,
  userAuthStateChanging: false,
  setUserError: null,
  createUserError: null,
  posts: [],
  userPosts: [],
  users: {},
};
