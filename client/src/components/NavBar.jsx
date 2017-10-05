import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import green from 'material-ui/colors/green';
import LegacySwitch from './LegacySwitch.jsx';
import Login from './Login.jsx';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

const NavBar = ({ showLegacy }) => (
  <AppBar position="fixed" >
    <Toolbar>
      <IconButton className="menuButton">
        <MenuIcon />
      </IconButton>
      <Typography type="title">Scream Machine</Typography>
      <LegacySwitch showLegacy={showLegacy}/>
      <Login />
    </Toolbar>
  </AppBar>
)

export default withStyles(styles)(NavBar);
