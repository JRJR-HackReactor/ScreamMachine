import React from 'react'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

export default class LevelEnd extends React.Component{

  constructor() {
    state = {
      open: false
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };


  render () {
    <div>
      <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
        <DialogTitle>{"You've Passed Level ***Insert Level***"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Have You Screamed Enough?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
              I'm Finished
            </Button>
            <Button onClick={this.handleRequestClose} color="primary">
              Next Level
            </Button>
        </DialogActions>
      </Dialog>
    </div>

  }


}
