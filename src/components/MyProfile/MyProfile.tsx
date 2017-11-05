import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Grid, Row, Col, FormGroup, FormControl, Button } from 'react-bootstrap';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { updateUserProfile } from '../../redux/actions/actionCreators';
import { State } from '../../redux/models/state';
import { User } from '../../redux/models/user';
import { Profile } from '../../redux/models/profile';

import Header from '../Header/Header';

interface MyProfileProps extends RouteComponentProps<{}> {
  user: User;
  updateUserProfile: (profile: Profile) => void;
}

interface MyProfileState {
  name: string;
  photoURL: string;
}

class MyProfile extends React.Component<MyProfileProps, MyProfileState> {
  constructor(props: MyProfileProps) {
    super(props);

    let defaultState = {
      name: '',
      photoURL: '',
    };

    if (this.props.user !== null) {
      defaultState = {
        name: this.props.user.name,
        photoURL: this.props.user.photoURL
      };
    }

    this.state = defaultState;

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePhotoURLChange = this.handlePhotoURLChange.bind(this);
  }

  handleNameChange(event: React.FormEvent<FormControl>) {
    const target = event.target as HTMLInputElement;

    this.setState({ name: target.value });
  }

  handlePhotoURLChange(event: React.FormEvent<FormControl>) {
    const target = event.target as HTMLInputElement;

    this.setState({ photoURL: target.value });
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
            <FormGroup
              controlId="updateProfileForm"
              // validationState={this.getEmailSignUpValidationState()}
            >
              <FormControl
                type="text"
                value={this.state.name}
                placeholder="Name"
                onChange={this.handleNameChange}
              />
              <br />
              <FormControl
                type="text"
                value={this.state.photoURL}
                placeholder="Link to an image"
                onChange={this.handlePhotoURLChange}
              />
              {/* {this.props.setUserError &&
                <div>
                  <HelpBlock>{this.props.setUserError.message}</HelpBlock>
                  {this.getHelpSuggestion()}
                </div>
              } */}
            </FormGroup>
            <Button
              bsStyle="default"
              bsSize="large"
              disabled={this.state.name === this.props.user.name && this.state.photoURL === this.props.user.photoURL}
              block={true}
              onClick={() => {
                this.props.updateUserProfile({ name: this.state.name, photoURL: this.state.photoURL });
              }}
            >
              Save changes
            </Button>
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
      updateUserProfile: (profile: Profile) => {
        dispatch(updateUserProfile(profile));
      },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
