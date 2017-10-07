import React, {Component} from 'react';
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Scream from './components/Scream.jsx';
import Profile from './components/Profile.jsx';
import Arcade from './components/Arcade.jsx';
import StressForm from './components/StressForm.jsx';
import {Row,Grid,Col,Button} from 'react-bootstrap';
import axios from 'axios';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { lightBlue, red } from 'material-ui/colors';

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: lightBlue,
    error: red
  }
});

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
    this.logout = this.logout.bind(this);
    this.signup = this.signup.bind(this);
    this.showLegacy = this.showLegacy.bind(this);
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

  login(user) {
    const notFound = 'We were unable to locate an account with that username. Please try again or go back to the home page and create a new account.'
    const incorrectPW = 'The username and password do not match. Please try again.'
    let context = this;
    axios({
      method: 'post',
      url: '/login',
      data: {
        username: user.username,
        password: user.password
      }
    })
    .then(function(result) {
      if (result.data === "User not found") {
        alert(notFound);
      } else if (result.data === "password is incorrect") {
        alert(incorrectPW);
      } else {
        context.setState({
        	isLoggedIn: true,
        	user: result.data
        });
        context.closeModal();
      }
    });
  }

  signup(user) {
    const userTaken = 'That username is already taken. Please choose a different username.'
    let context = this;
    axios({
      method: 'post',
      url: '/addUser',
      data: {
        username: user.username,
        password: user.password,
        first_name: user.firstname,
        last_name: user.lastname,
        github_username: user.github_username
      }
    })
    .then(function(result) {
      if (result.data === "User already exists in db") {
        alert(userTaken);
      } else {
        context.setState({
          isLoggedIn: true,
          user: result.data
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
          status.setState({
            isLoggedIn: results.isLoggedIn,
            user: results.data.user
          });
      });
  }

  // handles all events from the nav bar
  navClickHandler(eventKey) {
    if (this.state.user !== null) {
      if (eventKey === 'Profile') {
        //renders profile page instead of Legacy page
        this.setState({page: 'Profile'});
      } else if (eventKey === 'StressForm')  {
        //goes to daily stress form
        this.setState({page: 'StressForm'});
      } else if (eventKey === 'Legacy') {
        this.setState({page: 'Legacy'})
      }
    }
  }

  showLegacy() {
    if (this.state.page === 'Arcade'){
      this.setState({ page: 'Legacy' })
    } else {
      this.setState({ page: 'Arcade' })
    }
  }

  logout() {
    axios.get('/logout')
    .then( () => {
      this.setState({
        user: null,
        isLoggedIn: false
      })
    })
  }

  goToProfile() {
    this.setState({page: 'Profile'});
  }

  updateUserScore(score) {
    if (score > this.state.user.personalBest){
      var user = this.state.user;
      user.personalBest = score;
      this.setState({
        user: user
      })
    }
  }

  render() {
    var page;
    if (this.state.page === 'Legacy') {
      page = <Scream user={this.state.user}/>;
    } else if (this.state.page === 'Arcade') {
      page = <Arcade user={this.state.user} updateUserScore={this.updateUserScore.bind(this)}/>;
    } else if (this.state.page === 'Profile') {
      page = <Profile user={this.state.user}/>;
    } else if (this.state.page === 'StressForm') {
      page = <StressForm user={this.state.user} func={this.goToProfile}/>;
    } else {
      page = <div> Page did not load </div>
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <NavBar
            user={this.state.user}
            isLoggedIn={this.state.isLoggedIn}
            showLegacy={this.showLegacy}
            page={this.state.page}
            login={this.login}
            logout={this.logout}
            signup={this.signup}
            navHandler={this.navClickHandler}
            func={this.goToProfile}
          />
          <div style={{marginTop:65}}>
            {page}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
export default App;
