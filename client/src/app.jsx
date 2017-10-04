import React, {Component} from 'react';
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Arcade from './components/Arcade.jsx';
import Scream from './components/Scream.jsx';
import Profile from './components/Profile.jsx';
import StressForm from './components/StressForm.jsx';
import {Row,Grid,Col,Button} from 'react-bootstrap';
import axios from 'axios';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      page: 'Arcade',
      showSignup: false,
      showLogin: false,
      isLoggedIn: false,
      user: null,
    };
    this.navClickHandler = this.navClickHandler.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
    this.getLoginStatus();
  }

  //sets state that gets passed to modals props for show/hide behavior
  closeModal() {
    this.setState({
      showLogin: false,
      showSignup: false
    });
  }

  login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    const notFound = 'We were unable to locate an account with that username. Please try again or go back to the home page and create a new account.'
    const incorrectPW = 'The username and password do not match. Please try again.'
    axios({
      method: 'post',
      url: '/login',
      data: {
        username: username,
        password: password
      }
    })
    .then( (result) => {
        this.setState({
        	isLoggedIn: true,
        	user: result.data
        });
        this.closeModal();
      });
    }

  signup() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let firstname = document.getElementById('firstname').value;
    let lastname = document.getElementById('lastname').value;
    const userTaken = 'That username is already taken. Please choose a different username.'
    let context = this;
    axios({
      method: 'post',
      url: '/addUser',
      data: {
        username: username,
        password: password,
        first_name: firstname,
        last_name: lastname
      }
    })
    .then(function(result) {
      if (result.data === "User already exists in db") {
        alert(userTaken);
      } else {
        context.setState({
          isLoggedIn: true,
          user: username
        });
        context.closeModal();
      }
    });
  }

  /*
  Helper function that performs a GET request to check the session status of ther server.
  The session is the ultimate source of truth for a users login status.
  If the current state of the app differs from the session information, the state is
  updated.
  The state of the app is refreshed anytime a page is refreshed.
  */
  getLoginStatus() {
    let status = this;
    axios.get('/getStatus')
      .then((results) => {
        if(results.data.isLoggedIn !== status.state.isLoggedIn) {
          status.setState({
            isLoggedIn: true,
            user: results.data.username
          });
        }
      });
  }

  //handles all events from the nav bar
  navClickHandler(eventKey) {
    if (eventKey === 'logout') {
      this.setState({
        user: null,
        isLoggedIn: false
      });
      //should logout somehow (MAGIC, obviously)
    } else if (eventKey === 'login') {
      //displays login modal
      this.setState({showLogin: true});
    } else if (eventKey === 'signup') {
      //displays signup modal
      this.setState({showSignup: true});
    } else if (eventKey === 'scream') {
        //displays signup modal
        this.setState({page: 'scream'});
    } else if (this.state.user !== null) {
      if (eventKey === 'Profile') {
        //renders profile page instead of scream page
        this.setState({page: 'Profile'});
      } else if (eventKey === 'StressForm')  {
        //goes to daily stress form
        this.setState({page: 'StressForm'});
      }
    }
  }

  goToProfile() {
    this.setState({page: 'Profile'});
  }

  render() {
    var page;
    if (this.state.page === 'scream') {
      page = <Scream user={this.state.user}/>;
    } else if (this.state.page === 'Arcade') {
      page = <Arcade user={this.state.user} />;
    } else if (this.state.page === 'Profile') {
      page = <Profile user={this.state.user} />;
    } else if (this.state.page === 'StressForm') {
      page = <StressForm user={this.state.user} func={this.goToProfile}/>;
    } else {
      page = <div> Page did not load </div>
    }
    return (
      <Grid>
        <Row><Login closeModal={this.closeModal} showLogin={this.state.showLogin} login={this.login} /></Row>
        <Row> <Signup closeModal={this.closeModal} showSignup={this.state.showSignup} signup={this.signup}/> </Row>
        <Row>
          <NavBar isLoggedIn={this.state.isLoggedIn} func={this.navClickHandler} />
        </Row>
        <Row>
          {page}
        </Row>
      </Grid>
    );
  }
}
export default App;
