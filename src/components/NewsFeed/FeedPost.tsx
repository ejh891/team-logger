import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Row, Col, Image } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as moment from 'moment';

import { State } from '../../redux/models/state';
import { User } from '../../redux/models/user';
import { RatifiedPostBody } from '../../redux/models/postBody';
import { likePost, unlikePost } from '../../redux/actions/actionCreators';

import * as ratings from '../../maps/ratings';

import ReactionPicker from '../ReactionPicker/ReactionPicker';

import './newsFeed.css';

interface FeedPostProps extends RouteComponentProps<{}> {
  user: User;
  posts: RatifiedPostBody[];
  post: RatifiedPostBody;
  users: {[key: string]: User};
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
}

class FeedPost extends React.Component<FeedPostProps> {
  constructor(props: FeedPostProps) {
    super(props);

    this.likePost = this.likePost.bind(this);
    this.unlikePost = this.unlikePost.bind(this);
  }

  render() {
    const { 
    //  user,
      users,
      post
    } = this.props;
    
    // if our user map hasn't loaded yet
    if (Object.keys(users).length === 0) { return (<div>Loading...</div>); }

    const postAuthor = users[post.userId];
    const rating = ratings.ratingMap[post.rating];
    const timestamp = moment(post.timestamp);
    const timestampDisplay = moment().subtract(1, 'day').isBefore(timestamp) ? 
      timestamp.fromNow() : timestamp.format('ddd, MMM Do');
    
    return (
      <Row>
        <Col xs={12}>
          <div className="post">
            <div className="post-header" onClick={() => { this.props.history.push(`/users/${postAuthor.id}`); }}>
              <Image className="post-author-avatar" src={postAuthor.photoURL} circle={true}/>
              <div className="post-author-name">{postAuthor.name}</div>
              <div className="post-timestamp pull-right" title={timestamp.toString()}>{timestampDisplay}</div>
            </div>
            <div className="post-body">
              <Image className="post-body-rating-image" src={rating.imageSrc} />
              <div className="post-body-comment">{post.comment}</div>
            </div>
            <div className="post-actions">
            <ReactionPicker postId={post.id} />
            </div>
          </div>
          </Col>
      </Row>
    );
  }

  likePost() {
    this.props.likePost(this.props.post.id);
  }

  unlikePost() {
    this.props.unlikePost(this.props.post.id);
  }
}

const mapStateToProps = (state: State, ownProps: {post: RatifiedPostBody}) => {
  return {
    user: state.user,
    posts: state.posts,
    users: state.users,
    post: ownProps.post
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
      likePost: (postId: string) => {
        dispatch(likePost(postId));
      },
      unlikePost: (postId: string) => {
        dispatch(unlikePost(postId));
      }
    };
};

export default withRouter<{post: RatifiedPostBody}>(connect(mapStateToProps, mapDispatchToProps)(FeedPost));
