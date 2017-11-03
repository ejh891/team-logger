import { actionTypes, AnyAction } from './actions';
import { State, defaultState } from './models/state';

export default (state: State = defaultState, action: AnyAction) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      };
    case actionTypes.SET_USER_AUTH_STATE_CHANGING:
      return {
        ...state,
        userAuthStateChanging: action.userAuthStateChanging
      };
    default:
      return state;
  }
};
