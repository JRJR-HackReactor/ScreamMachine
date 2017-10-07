import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

const styles = {
  textField: {
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 15,
    display: "block"
  }
}

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      firstname: '',
      lastname: '',
      username: '',
      github_username: '',
      password: '',
      verifyPassword: ''
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.signup = props.signup;
  }

  handleOpen() {
    this.setState({ open: true })
  }

  handleClose() {
    this.setState({ open: false })
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value
      });
    }
  }

  handleSubmit() {
    this.signup(
      {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        username: this.state.username,
        password: this.state.password,
        github_username: this.state.github_username
      }
    );
    this.handleClose();
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    const { classes, isLoggedIn, page } = this.props;
    if (!isLoggedIn) {
      return (
        <div className="signupButton">
          <Button raised color={page === 'Arcade' ? 'accent' : 'primary'} onClick={this.handleOpen}>Sign Up</Button>
          <Dialog open={this.state.open} onRequestClose={this.handleClose}>
            <DialogTitle>{'Sign Up'}</DialogTitle>
            <DialogContent>
              <form onKeyPress={this.handleKeyPress}>
                <TextField
                  label="First Name"
                  placeholder="First Name"
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange('firstname')}
                />
                <TextField
                  label="Last Name"
                  placeholder="Last Name"
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange('lastname')}
                />
                <TextField
                  label="Github Username"
                  placeholder="github username"
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange('github_username')}
                />
                <TextField
                  label="Enter Username"
                  placeholder="username"
                  className={classes.textField}
                  margin="normal"
                  onChange={this.handleChange('username')}
                />
                <TextField
                  label="Enter Password"
                  placeholder="password"
                  className={classes.textField}
                  margin="normal"
                  type="password"
                  onChange={this.handleChange('password')}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>Cancel</Button>
              <Button onClick={this.handleSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      )
    } else {
      return null
    }
  }
}

export default withStyles(styles)(Signup);
