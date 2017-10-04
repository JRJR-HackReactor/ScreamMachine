import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

var NavBar = (props) => (
  <Navbar className='NavBar' onSelect={props.func} >
    <Navbar.Header>
      <Navbar.Brand>
        <a href='/'>Scream Machine</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavDropdown title="Profile" id="basic-nav-dropdown">
        <MenuItem eventKey={'Profile'}>Your Graphs</MenuItem>
        <MenuItem eventKey={'StressForm'}>Daily Stress Form</MenuItem>
      </NavDropdown>
      <NavItem eventKey={'scream'} href="#">Scream Page</NavItem>
    </Nav>
    {props.isLoggedIn === false ?
      <Nav pullRight>
        <NavItem  eventKey={'login'} href="#">Login</NavItem>
        <NavItem  eventKey={'signup'} href="#">Sign Up</NavItem>
      </Nav> :
      <Nav pullRight>
        <NavItem  eventKey={'logout'} href="#">Logout</NavItem>
      </Nav>}
  </Navbar>
)

export default NavBar
