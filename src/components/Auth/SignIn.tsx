import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col, Button, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { Redirect, Link, RouteComponentProps } from 'react-router-dom';

import { State } from '../../redux/models/state';
import { 
  logInUserViaFacebook,
  logInUserViaEmail,
  sendPasswordResetEmail,
  clearSetUserError
} from '../../redux/actions/actionCreators';
import { NullableUser } from '../../redux/models/user';
import { NullableFirebaseError } from '../../redux/models/firebaseError';
import { authErrorCodes } from '../../enums/authErrorCodes';

const style = {
  facebookButton: {
    marginTop: '30px'
  },
  or: {
    textAlign: 'center',
    marginTop: '20px'
  },
  emailSignIn: {
    marginTop: '20px'
  },
  createAccountLink: {
    marginTop: '10px'
  }
};

interface SignInProps extends RouteComponentProps<{}> {
  user: NullableUser;
  setUserError: NullableFirebaseError;
  logInUserViaEmail: (email: string, password: string) => void;
  logInUserViaFacebook: () => void;
  sendPasswordResetEmail: (email: string) => void;
  clearSetUserError: () => void;
}

interface SignInState {
  email: string;
  password: string;
}

class SignIn extends React.Component<SignInProps, SignInState> {
  constructor(props: SignInProps) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.getEmailSignUpValidationState = this.getEmailSignUpValidationState.bind(this);
    this.getHelpSuggestion = this.getHelpSuggestion.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  getEmailSignUpValidationState() {
    if (this.props.setUserError !== null) {
      return 'error';
    }

    return undefined;
  }

  getHelpSuggestion() {
    if (this.props.setUserError === null) { return null; }

    switch (this.props.setUserError.code) {
      case authErrorCodes.USER_NOT_FOUND:
        return(<div>Do you need to <Link to="sign-up">Create an account</Link>?</div>);
      case authErrorCodes.BAD_PASSWORD:
        return (
          <a onClick={() => {this.props.sendPasswordResetEmail(this.state.email); }}>Reset your password?</a>
        );
      default:
        return null;
    }
  }

  handleEmailChange(event: React.FormEvent<FormControl>) {
    const target = event.target as HTMLInputElement;
    const email = target.value;
    
    if (this.props.setUserError !== null) {
      this.props.clearSetUserError();
    }
    this.setState({ email });
  }

  handlePasswordChange(event: React.FormEvent<FormControl>) {
    const target = event.target as HTMLInputElement;
    const password = target.value;

    if (this.props.setUserError !== null) {
      this.props.clearSetUserError();
    }

    this.setState({ password });
  }

  render() {
    const { user } = this.props;

    if (user !== null) {
      return (<Redirect to={{pathname: '/'}}/>);
    }

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h1>Welcome!</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button
              bsStyle="primary"
              bsSize="large"
              block={true}
              onClick={this.props.logInUserViaFacebook}
            >
              Log In with Facebook
            </Button>
          </Col>
        </Row>
        <Row style={style.or}>
          <Col xs={12}>
            <div>OR</div>
          </Col>
        </Row>
        <Row style={style.emailSignIn}>
          <Col xs={12}>
            <FormGroup
              controlId="signInInputs"
              validationState={this.getEmailSignUpValidationState()}
            >
              <FormControl
                type="email"
                bsSize="large"
                value={this.state.email}
                placeholder="Email"
                onChange={this.handleEmailChange}
              />
              <br />
              <FormControl
                type="password"
                bsSize="large"
                value={this.state.password}
                placeholder="Password"
                onChange={this.handlePasswordChange}
              />
              {this.props.setUserError &&
                <div>
                  <HelpBlock>{this.props.setUserError.message}</HelpBlock>
                  {this.getHelpSuggestion()}
                </div>
              }
            </FormGroup>
            <Button
              bsStyle="default"
              bsSize="large"
              block={true}
              onClick={() => { this.props.logInUserViaEmail(this.state.email, this.state.password); }}
            >
              Log In with Email
            </Button>
          </Col>
        </Row>
        <Row style={style.createAccountLink}>
          <Col xs={12}>
              <div>New here? <Link to="sign-up">Create an account</Link></div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user,
    setUserError: state.setUserError,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
      logInUserViaFacebook: () => { dispatch(logInUserViaFacebook()); },
      logInUserViaEmail: (email: string, password: string) => { 
        dispatch(logInUserViaEmail(email, password)); 
      },
      sendPasswordResetEmail: (email: string) => {
        dispatch(sendPasswordResetEmail(email));
      },
      clearSetUserError: () => { dispatch(clearSetUserError()); }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
