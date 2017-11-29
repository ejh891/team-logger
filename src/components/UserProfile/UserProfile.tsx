import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';

import { State } from '../../redux/models/state';
import { User } from '../../redux/models/user';
import { RatifiedPostBody } from '../../redux/models/postBody';

import Header from '../Header/Header';
import UserFeed from './UserFeed';

interface UserProfileProps extends RouteComponentProps<{ id: string }> {
  users: {[key: string]: User};
  posts: RatifiedPostBody[];
}

class UserProfile extends React.Component<UserProfileProps> {
  render() {
    // if our user map hasn't loaded yet
    if (Object.keys(this.props.users).length === 0) { return (<div>Loading...</div>); }

    const { id } = this.props.match.params;

    const user = this.props.users[id];

    return (
      <Grid>
        <Header />
        <Row style={{marginTop: '40px'}}>
          <Col xs={12}>
            <h1>{user.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {user === null && 
              <div>Sorry, we couldn't find any info on that user</div>
            }
            {user !== null &&
              <Image style={{height: '100px', width: '100px'}} src={user.photoURL} circle={true} />
            }
          </Col>
        </Row>
        <UserFeed userId={id} />
      </Grid>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    users: state.users,
    posts: state.posts,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
