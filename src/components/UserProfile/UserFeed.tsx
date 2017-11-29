/// <reference path="../../typings/react-visibility-sensor.d.ts" />

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Redirect } from 'react-router-dom';
import VisibilitySensor from 'react-visibility-sensor';

import { State } from '../../redux/models/state';
import { NullableUser } from '../../redux/models/user';
import { RatifiedPostBody } from '../../redux/models/postBody';
import { loadSomeUserPosts } from '../../redux/actions/actionCreators';

import FeedPost from '../NewsFeed/FeedPost';

import '../NewsFeed/newsFeed.css';

const logo = require('../../images/logo.png');

interface UserFeedOwnProps {
  userId: string;
}

interface UserFeedProps extends UserFeedOwnProps {
  user: NullableUser;
  userPosts: RatifiedPostBody[];
  loadSomeUserPosts: (userId: string) => void;
}

class UserFeed extends React.Component<UserFeedProps> {
  constructor(props: UserFeedProps) {
    super(props);

    this.visibilitySensorOnChange = this.visibilitySensorOnChange.bind(this);
  }

  render() {
    const { user, userPosts } = this.props;

    if (user === null) {
      return (<Redirect to={{pathname: '/sign-in'}}/>);
    }

    return (
      <div>
        {userPosts.map((post, index) => <FeedPost key={post.id} post={post} />)}
        <VisibilitySensor onChange={this.visibilitySensorOnChange}>
          <div className="infinite-scroll-loader">
            <img className="infinite-scroll-loader-image" src={logo} />
          </div>
        </VisibilitySensor>
      </div>
    );
  }

  visibilitySensorOnChange(isVisible: boolean) {
    if (isVisible) {
      this.props.loadSomeUserPosts(this.props.userId);
    }
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
    userPosts: state.userPosts
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
      loadSomeUserPosts: (userId: string) => {
        dispatch(loadSomeUserPosts(userId));
      },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFeed);
