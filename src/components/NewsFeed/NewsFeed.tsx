/// <reference path="../../typings/react-visibility-sensor.d.ts" />

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import VisibilitySensor from 'react-visibility-sensor';

import { State } from '../../redux/models/state';
import { NullableUser } from '../../redux/models/user';
import { RatifiedPostBody } from '../../redux/models/postBody';
import { loadSomePosts } from '../../redux/actions/actionCreators';

import Header from '../Header/Header';
import FeedPost from './FeedPost';

import './newsFeed.css';

const logo = require('../../images/logo.png');

interface NewsFeedProps extends RouteComponentProps<{}> {
  user: NullableUser;
  userAuthStateChanging: boolean;
  posts: RatifiedPostBody[];
  loadSomePosts: () => void;
}

class NewsFeed extends React.Component<NewsFeedProps> {
  constructor(props: NewsFeedProps) {
    super(props);

    this.visibilitySensorOnChange = this.visibilitySensorOnChange.bind(this);
  }

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
            <h1>Poo's Feed</h1>
          </Col>
        </Row>
        {posts.map((post, index) => <FeedPost key={post.id} post={post} />)}
        <VisibilitySensor onChange={this.visibilitySensorOnChange}>
          <div className="infinite-scroll-loader">
            <img className="infinite-scroll-loader-image" src={logo} />
          </div>
        </VisibilitySensor>
        <FloatingActionButton
          className="create-post-button"
          backgroundColor="#663333"
          onClick={() => { this.props.history.push('/create-post'); }}
        >
          <ContentAdd />
        </FloatingActionButton>
      </Grid>
    );
  }

  visibilitySensorOnChange(isVisible: boolean) {
    if (isVisible) {
      this.props.loadSomePosts();
    }
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
    posts: state.posts
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
      loadSomePosts: () => {
        dispatch(loadSomePosts());
      },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);
