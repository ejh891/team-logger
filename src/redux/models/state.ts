import { NullableUser } from './user';

export interface State {
    user: NullableUser;
    userAuthStateChanging: boolean;
}

export const defaultState: State = {
  user: null,
  userAuthStateChanging: false,
};
