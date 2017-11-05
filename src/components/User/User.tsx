import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { State } from '../../redux/models/state';
import { NullableUser } from '../../redux/models/user';

import Header from '../Header/Header';

interface UserProps extends RouteComponentProps<{ id: string }> {
  user: NullableUser;
}

class User extends React.Component<UserProps> {
  render() {
    if (this.props.user === null) {
      return (<Redirect to={{pathname: '/sign-in'}}/>);
    }
    
    const { id } = this.props.match.params;

    const user = {
      id,
      name: 'user' + id,
      photoURL: 'http://www.google.com/favicon.ico',
    };

    return (
      <Grid>
        <Header />
        <Row>
          <Col xs={12}>
            {user === null && 
              <div>Sorry, we couldn't find any info on that user</div>
            }
            {user !== null &&
              <div>
                <img src={user.photoURL} />
                <div>{user.name}</div>
              </div>
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
