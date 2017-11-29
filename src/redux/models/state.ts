import { User, NullableUser } from './user';
import { NullableFirebaseError } from './firebaseError';
import { RatifiedPostBody } from './postBody';

export interface State {
    user: NullableUser;
    userAuthStateChanging: boolean;
    setUserError: NullableFirebaseError;
    createUserError: NullableFirebaseError;
    posts: RatifiedPostBody[];
    postsByUserMap: Map<string, RatifiedPostBody[]>;
    users: {[key: string]: User}; // probably should be a map
}

export const defaultState: State = {
  user: null,
  userAuthStateChanging: false,
  setUserError: null,
  createUserError: null,
  posts: [],
  postsByUserMap: new Map(),
  users: {},
};
