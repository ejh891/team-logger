import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';

import { State } from '../../redux/models/state';
import { NullableUser } from '../../redux/models/user';
import Header from '../Header/Header';

interface AppProps {
  user: NullableUser;
  userAuthStateChanging: boolean;
}

class App extends React.Component<AppProps> {
  constructor(props: AppProps) {
    super(props);

  }

  render() {
    const { user, userAuthStateChanging } = this.props;

    return (
      <Grid>
        <Header />
        <Row>
          <Col xs={12}>
            {userAuthStateChanging === true &&
                <div>Contacting Facebook...</div>
            }
            {user !== null &&
              <div>
                <div>Id: {user.id}</div>
                <div>Name: {user.name}</div>
                <img src={user.photoURL} />
              </div>
            }
            {user === null &&
              <div>Welcome! Please log in to continue</div>
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
    userAuthStateChanging: state.userAuthStateChanging,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
