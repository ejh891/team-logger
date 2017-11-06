import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { State } from '../../redux/models/state';
import { NullableUser } from '../../redux/models/user';
import { PostBody } from '../../redux/models/postBody';

import Header from '../Header/Header';
import FeedPost from './FeedPost';

import './newsFeed.css';

interface NewsFeedProps extends RouteComponentProps<{}> {
  user: NullableUser;
  userAuthStateChanging: boolean;
  posts: PostBody[];
}

class NewsFeed extends React.Component<NewsFeedProps> {
  render() {
    const { user, posts } = this.props;

    if (user === null) {
      return (<Redirect to={{pathname: '/sign-in'}}/>);
    }

    return (
      <Grid>
        <Header />
        <Row style={{marginTop: '40px'}}>
          <Col xs={12}>
            <h1>Poos Feed</h1>
          </Col>
        </Row>
        <div id="create-post-button" onClick={() => { this.props.history.push('/create-post'); }}>+</div>
        {posts.map((post, index) => <FeedPost key={index} post={post} />)}
      </Grid>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
    posts: state.posts
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
