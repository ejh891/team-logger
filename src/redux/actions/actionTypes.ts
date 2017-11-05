/**********************************************************************************************************************
 * ActionTypes - declare all of the possible action types so that the reducer can Switch across them
 **********************************************************************************************************************/
export enum actionTypes {
  SET_USER_SUCCESS = 'SET_USER_SUCCESS',
  SET_USER_ERROR = 'SET_USER_ERROR',
  CLEAR_SET_USER_ERROR = 'CLEAR_SET_USER_ERROR',
  CREATE_USER_ERROR = 'CREATE_USER_ERROR',
  CLEAR_CREATE_USER_ERROR = 'CLEAR_CREATE_USER_ERROR',
  SET_USER_AUTH_STATE_CHANGING = 'SET_USER_AUTH_STATE_CHANGING',
  UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS',

  // system action is never dispatched, but it forces us to add a default case to our reducers
  // this is important so that redux and middleware can dispatch their own actions and we'll handle it gracefully
  DEFAULT_ACTION = 'DEFAULT_ACTION',
}
