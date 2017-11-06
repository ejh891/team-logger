import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Row, Col, Image } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as moment from 'moment';

import { State } from '../../redux/models/state';
import { User } from '../../redux/models/user';
import { PostBody } from '../../redux/models/postBody';
import * as ratings from '../../maps/ratings';

import './newsFeed.css';

interface FeedPostProps extends RouteComponentProps<{}> {
  posts: PostBody[];
  post: PostBody;
  users: {[key: string]: User};
}

class FeedPost extends React.Component<FeedPostProps> {
  render() {
    const { users, post } = this.props;
    
    // if our user map hasn't loaded yet
    if (Object.keys(users).length === 0) { return (<div>Loading...</div>); }

    const user = users[post.userId];
    const rating = ratings.ratingMap[post.rating];
    const timestamp = moment(post.timestamp);

    return (
      <Row>
        <Col xs={12}>
          <div className="post">
            <div className="post-header" onClick={() => { this.props.history.push(`/users/${user.id}`); }}>
              <Image className="post-author-avatar" src={user.photoURL} circle={true}/>
              <div className="post-author-name">{user.name}</div>
              <div className="post-timestamp pull-right" title={timestamp.toString()}>{timestamp.fromNow()}</div>
            </div>
            <div className="post-body">
              <Image className="post-body-rating-image" src={rating.imageSrc} />
              <div className="post-body-comment">{post.comment}</div>
            </div>
          </div>
          </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state: State, ownProps: {post: PostBody}) => {
  return {
    posts: state.posts,
    users: state.users,
    post: ownProps.post
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {};
};

export default withRouter<{post: PostBody}>(connect(mapStateToProps, mapDispatchToProps)(FeedPost));
