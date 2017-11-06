import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Row, Nav, Navbar, NavItem, Image } from 'react-bootstrap';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';

import { State } from '../../redux/models/state';
import { logOutUser } from '../../redux/actions/actionCreators';
import { User } from '../../redux/models/user';

const defaultAvatar = require('../../images/poop-emoji.png');
const logo = require('../../images/logo.png');

const style = {
  profileImage: {
    display: 'inline-block',
    marginRight: '5px',
    width: '20px',
    height: '20px',
  },
};

interface HeaderProps extends RouteComponentProps<{}> {
  user: User;
  logOutUser: () => void;
}

class Header extends React.Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);

    this.getAvatar = this.getAvatar.bind(this);
  }
  
  getAvatar() {
    return this.props.user.photoURL !== null ? this.props.user.photoURL : defaultAvatar;
  }

  render() {
    const { user } = this.props;
    return (
      <Row>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={`/`}>
                <img style={style.profileImage} src={logo} alt="Logo"/>
                <span>Logger</span>
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem onClick={() => { this.props.history.push('my-profile'); }}>
                <Image
                  style={style.profileImage}
                  src={this.getAvatar()}
                  alt="Profile picture"
                  circle={true}
                />
                <span>{user.name || 'Set up profile'}</span>
              </NavItem>
              <NavItem onClick={this.props.logOutUser}>Log out</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
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
      logOutUser: () => { dispatch(logOutUser()); },
    };
};

export default withRouter<{}>(connect(mapStateToProps, mapDispatchToProps)(Header));
