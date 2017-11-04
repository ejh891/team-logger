import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { State } from '../../redux/models/state';
import { observeAuthState, logInUser } from '../../redux/actions';
import { NullableUser } from '../../redux/models/user';

interface AuthProps {
  user: NullableUser;
  logInUser: () => void;
  observeAuthState: () => void;
}

class Auth extends React.Component<AuthProps> {
  componentDidMount() {
    // sets up listener to dispatch appropriate actions when auth state changes
    this.props.observeAuthState();
  }

  render() {
    const { user } = this.props;

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            {user === null &&
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  block={true}
                  onClick={this.props.logInUser}
                >
                  Log In with Facebook
                </Button>
            }
            {user !== null &&
              <Redirect to={{pathname: '/'}}/>
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
    return {
      logInUser: () => { dispatch(logInUser()); },
      observeAuthState: () => { dispatch(observeAuthState()); },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
