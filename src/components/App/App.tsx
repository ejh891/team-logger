import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

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
    const { user } = this.props;

    if (user === null) {
      return (<Redirect to={{pathname: '/sign-in'}}/>);
    }

    return (
      <Grid>
        <Header />
        <Row>
          <Col xs={12}>
            <Button>Do a thing</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
