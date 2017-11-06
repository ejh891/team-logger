import { actionTypes } from './actions/actionTypes';
import { AnyAction } from './actions/actions';
import { State, defaultState } from './models/state';

export default (state: State = defaultState, action: AnyAction) => {
  switch (action.type) {
    case actionTypes.SET_USER_SUCCESS:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_USER_ERROR:
      return {
        ...state,
        setUserError: action.error
      };
    case actionTypes.CLEAR_SET_USER_ERROR:
      return {
        ...state,
        setUserError: null
      };
    case actionTypes.CREATE_USER_ERROR:
      return {
        ...state,
        createUserError: action.error
      };
    case actionTypes.CLEAR_CREATE_USER_ERROR:
      return {
        ...state,
        createUserError: null
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
    case actionTypes.SET_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.posts
      };
      case actionTypes.SET_USERS_SUCCESS:
      return {
        ...state,
        users: action.users
      };
    default:
      return state;
  }
};
