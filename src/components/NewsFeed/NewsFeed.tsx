import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Image } from 'react-bootstrap';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import * as moment from 'moment';

import { State } from '../../redux/models/state';
import { User, NullableUser } from '../../redux/models/user';
import { PostBody } from '../../redux/models/postBody';
import Header from '../Header/Header';
import * as ratings from '../../maps/ratings';

import './newsFeed.css';

interface NewsFeedProps extends RouteComponentProps<{}> {
  user: NullableUser;
  userAuthStateChanging: boolean;
  posts: PostBody[];
  users: {[key: string]: User};
}

class NewsFeed extends React.Component<NewsFeedProps> {
  constructor(props: NewsFeedProps) {
    super(props);

    this.renderPost = this.renderPost.bind(this);
  }

  renderPost(post: PostBody, index: number) {
    const { users } = this.props;

    const user = users[post.userId];
    const rating = ratings.ratingMap[post.rating];
    const timestamp = moment(post.timestamp);

    return (
      <div key={index} className="post">
        <div className="post-header">
          <Image className="post-author-avatar" src={user.photoURL} circle={true}/>
          <div className="post-author-name">{user.name}</div>
          <div className="post-timestamp pull-right" title={timestamp.toString()}>{timestamp.fromNow()}</div>
        </div>
        <div className="post-body">
          <Image className="post-body-rating-image" src={rating.imageSrc} />
          <div className="post-body-comment">{post.comment}</div>
        </div>
      </div>
    );
  }

  render() {
    const { user, posts, users } = this.props;

    if (user === null) {
      return (<Redirect to={{pathname: '/sign-in'}}/>);
    }

    // if our user map hasn't loaded yet
    if (Object.keys(users).length === 0) { return (<div>Loading...</div>); }

    return (
      <Grid>
        <Header />
        <h1>News Feed</h1>
        <div id="create-post-button" onClick={() => { this.props.history.push('/create-post'); }}>+</div>
        {posts.map((post, index) => {
          return this.renderPost(post, index);
        })}
      </Grid>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
    posts: state.posts,
    users: state.users
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
