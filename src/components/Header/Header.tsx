import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Row, Col, Button } from 'react-bootstrap';

import { State } from '../../redux/models/state';
import { observeAuthState, logInUser, logOutUser } from '../../redux/actions';
import { NullableUser } from '../../redux/models/user';

interface HeaderProps {
  user: NullableUser;
  observeAuthState: () => void;
  logInUser: () => void;
  logOutUser: () => void;
}

class Header extends React.Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);

  }

  componentDidMount() {
    // sets up listener to dispatch appropriate actions when auth state changes
    this.props.observeAuthState();
  }
  
  render() {
    const { user } = this.props;
    return (
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
            <Button
              bsStyle="primary"
              bsSize="large"
              block={true}
              onClick={this.props.logOutUser}
            >
              Log Out
            </Button>
          }
        </Col>
      </Row>
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
      logOutUser: () => { dispatch(logOutUser()); },
      observeAuthState: () => { dispatch(observeAuthState()); },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
