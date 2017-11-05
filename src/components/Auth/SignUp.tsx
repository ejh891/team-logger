import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col, FormGroup, FormControl, HelpBlock, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { createUserViaEmail } from '../../redux/actions';
import { State } from '../../redux/models/state';
import { NullableFirebaseError } from '../../redux/models/firebaseError';
import { NullableUser } from '../../redux/models/user';

interface SignUpProps {
  user: NullableUser;
  setUserError: NullableFirebaseError;
  createUserViaEmail: (email: string, password: string) => void;
}

interface SignUpState {
  email: string;
  password: string;
  passwordAgain: string;

  emailError: string | null;
  passwordError: string | null;
  passwordAgainError: string | null;
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
  constructor(props: SignUpProps) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordAgain: '',

      emailError: null,
      passwordError: null,
      passwordAgainError: null,
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordAgainChange = this.handlePasswordAgainChange.bind(this);
    this.getPasswordSignUpValidationState = this.getPasswordSignUpValidationState.bind(this);
    this.getPasswordAgainSignUpValidationState = this.getPasswordAgainSignUpValidationState.bind(this);
  }

  handleEmailChange(event: React.FormEvent<FormControl>) {
    const target = event.target as HTMLInputElement;

    this.setState({email: target.value});
  }

  handlePasswordChange(event: React.FormEvent<FormControl>) {
    const target = event.target as HTMLInputElement;

    const password = target.value;
    let passwordError = null;
    if (password.length > 0 && password.length < 6) {
      passwordError = 'Password must be at least 6 characters';
    }

    this.setState({ password, passwordError });
  }

  handlePasswordAgainChange(event: React.FormEvent<FormControl>) {
    const target = event.target as HTMLInputElement;

    const passwordAgain = target.value;
    let passwordAgainError = null;
    if (passwordAgain.length > 0 && passwordAgain !== this.state.password) {
      passwordAgainError = 'Passwords don\'t match';
    }

    this.setState({ passwordAgain, passwordAgainError });
  }

  getPasswordSignUpValidationState(): 'success' | 'error' | undefined {
    if (this.state.password.length === 0) {
      return undefined;
    } else if (this.state.password.length >= 6) {
      return 'success';
    } else {
      return 'error';
    }
  }

  getPasswordAgainSignUpValidationState(): 'success' | 'error' | undefined {
    if (this.state.passwordAgain.length === 0) {
      return undefined;
    } else if (this.state.password === this.state.passwordAgain) {
      return 'success';
    } else {
      return 'error';
    }
  }

  render() {
    if (this.props.user !== null) {
      return (<Redirect to={{pathname: '/'}}/>);
    }

    const { email, password, passwordAgain, emailError, passwordError, passwordAgainError } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h1>Create an account</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup
              controlId="signUpForm"
            >
              <FormControl
                type="email"
                bsSize="large"
                value={email}
                placeholder="Email"
                onChange={this.handleEmailChange}
              />
              <FormControl.Feedback />
              {emailError &&
                <HelpBlock>{emailError}</HelpBlock>
              }
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup
              controlId="passwordInput"
              validationState={this.getPasswordSignUpValidationState()}
            >
              <FormControl
                type="password"
                bsSize="large"
                value={password}
                placeholder="Password"
                onChange={this.handlePasswordChange}
              />
              <FormControl.Feedback />
              {passwordError &&
                <HelpBlock>{passwordError}</HelpBlock>
              }
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup
              controlId="passwordAgainInput"
              validationState={this.getPasswordAgainSignUpValidationState()}
            >
              <FormControl
                type="password"
                bsSize="large"
                value={passwordAgain}
                placeholder="Password Again"
                onChange={this.handlePasswordAgainChange}
              />
              <FormControl.Feedback />
              {this.state.passwordAgainError &&
                <HelpBlock>{passwordAgainError}</HelpBlock>
              }
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button
              disabled={
                email.length === 0 ||
                password.length === 0 ||
                passwordAgain.length === 0 ||
                emailError !== null ||
                passwordError !== null ||
                passwordAgainError !== null
              }
              block={true}
              bsStyle="primary"
              bsSize="large"
              onClick={() => { this.props.createUserViaEmail(this.state.email, this.state.password); }}
            >
              Create account
            </Button>
            {this.props.setUserError !== null && 
              <div>{this.props.setUserError.message}</div>
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
    setUserError: state.setUserError,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
      createUserViaEmail: (email: string, password: string) => { 
        dispatch(createUserViaEmail(email, password)); 
      },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);