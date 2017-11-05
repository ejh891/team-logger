import { actionTypes, AnyAction } from './actions';
import { State, defaultState } from './models/state';

export default (state: State = defaultState, action: AnyAction) => {
  switch (action.type) {
    case actionTypes.SET_USER_SUCCESS:
      return {
        ...state,
        user: action.user,
        setUserError: null, // remove any auth errors
      };
    case actionTypes.SET_USER_ERROR:
      return {
        ...state,
        setUserError: action.error
      };
    case actionTypes.SET_USER_AUTH_STATE_CHANGING:
      return {
        ...state,
        userAuthStateChanging: action.userAuthStateChanging
      };
    case actionTypes.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        user: Object.assign({}, state.user, action.profile) // merge profile into user
      };
    default:
      return state;
  }
};
