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
        posts: action.posts,
      };
    case actionTypes.SET_USER_POSTS_SUCCESS:
      return {
        ...state,
        userPosts: action.userPosts,
      };
    case actionTypes.SET_USERS_SUCCESS:
      return {
        ...state,
        users: action.users
      };
    case actionTypes.OPTIMISTIC_REACT_TO_POST:
      if (state.user === null) { // todo: find a better way to assert that the user will exist
        throw new Error('User is null');
      }

      const targetPosts = state.posts.filter(post => post.id === action.postId);
      if (targetPosts.length !== 1) { 
        throw new Error(`Expected exactly one matching post. Got ${targetPosts.length}`);
      }

      const targetPostClone = Object.assign({}, targetPosts[0]);
      targetPostClone.reactionMap = Object.assign(
        {},
        targetPostClone.reactionMap,
        {[state.user.id]: action.emojiShortName}
      );

      const targetPostIndex = state.posts.indexOf(targetPosts[0]);
      const postsBeforeTarget = state.posts.slice(0, targetPostIndex);
      const postsAfterTarget = state.posts.slice(targetPostIndex + 1, state.posts.length);

      return {
        ...state,
        posts: [...postsBeforeTarget, targetPostClone, ...postsAfterTarget]
      };
    case actionTypes.OPTIMISTIC_REACT_TO_POST:
      if (state.user === null) { // todo: find a better way to assert that the user will exist
        throw new Error('User is null');
      }

      const outpTargetPosts = state.posts.filter(post => post.id === action.postId);
      if (outpTargetPosts.length !== 1) { 
        throw new Error(`Expected exactly one matching post. Got ${outpTargetPosts.length}`);
      }

      const outpTargetPostClone = Object.assign({}, outpTargetPosts[0]);
      delete outpTargetPostClone.reactionMap[state.user.id];

      const outpTargetPostIndex = state.posts.indexOf(outpTargetPosts[0]);
      const outpPostsBeforeTarget = state.posts.slice(0, outpTargetPostIndex);
      const outpPostsAfterTarget = state.posts.slice(outpTargetPostIndex + 1, state.posts.length);

      return {
        ...state,
        posts: [...outpPostsBeforeTarget, outpTargetPostClone, ...outpPostsAfterTarget]
      };
    default:
      return state;
  }
};
