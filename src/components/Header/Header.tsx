import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Row, Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

interface HeaderProps {
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
                <span>App Name</span>
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem>
                <img style={style.profileImage} src={this.getAvatar()} alt="Profile picture"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
