import { NullableUser } from './user';
import { NullableFirebaseError } from './firebaseError';

export interface State {
    user: NullableUser;
    userAuthStateChanging: boolean;
    setUserError: NullableFirebaseError;
}

export const defaultState: State = {
  user: null,
  userAuthStateChanging: false,
  setUserError: null
};
