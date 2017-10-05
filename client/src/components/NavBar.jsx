import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import LegacySwitch from './LegacySwitch.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';

const NavBar = ({ showLegacy, login, logout, user, isLoggedIn, signup }) => (
  <AppBar position="absolute" className="navBar" square>
    <Toolbar>
      <IconButton className="menuButton">
        <MenuIcon />
      </IconButton>
      <Typography type="title">Scream Machine</Typography>
      <LegacySwitch showLegacy={showLegacy}/>
      <Login
        user={user}
        login={login}
        logout={logout}
        isLoggedIn={isLoggedIn}
        className="login"
      />
      <Signup signup={signup} isLoggedIn={isLoggedIn}/>
    </Toolbar>
  </AppBar>
)

export default NavBar;
