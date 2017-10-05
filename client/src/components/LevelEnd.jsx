import React from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');


export default class LevelEnd extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: props.levelEnd || false,
      payload: {}
    }

    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleNextLevel = this.handleNextLevel.bind(this)
  };

  handleOpen() {
    this.setState({
      open: true
    })
    //console.log(window.location)
  }

  handleClose() {
    this.setState({
      open: false
    })
  }

  handleNextLevel() {
    //change the state of HighStriker to go up to the next level
  }

  handleStartOver() {
    //change the state of HighStriker to go back to the first level
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      payload: nextProps.payload
    })
  }

  render () {
    const url = "https://www.youtube.com/watch?v=J---aiyznGQ";
    const quote = 'I Got to Level **insert level**. Think You Can Beat Me?'

    const passed = (
      <Dialog open={this.state.open} onRequestClose={this.handleClose}>
        <DialogTitle>{"You've Passed Level ***Insert Level***"}</DialogTitle>
        <DialogContent>
          {JSON.stringify(this.state.payload)}
          <div> Share Your Score! </div>
          <div className="sharebutton">
            <FacebookShareButton
              url={url}
              quote={quote}>
              <FacebookIcon
                size={32}
              square />
            </FacebookShareButton>
          </div>
          <div className="sharebutton">
            <TwitterShareButton
              url={url}
              quote={quote}>
              <TwitterIcon
                size={32}
              square />
            </TwitterShareButton>
          </div>
          <div className="sharebutton">
            <GooglePlusShareButton
              url={url}
              quote={quote}>
              <GooglePlusIcon
                size={32}
              square />
            </GooglePlusShareButton>
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            I'm Finished
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Next Level
          </Button>
        </DialogActions>
      </Dialog>
    );

    const failed = (
      <Dialog open={this.state.open} onRequestClose={this.handleClose}>
        <DialogTitle>{"You didn't pass this level"}</DialogTitle>
        <DialogContent>
          {JSON.stringify(this.state.payload)}
          <div> Share Your Score! </div>
          <div className="sharebutton">
            <FacebookShareButton
              url={url}
              quote={quote}>
              <FacebookIcon
                size={32}
              square />
            </FacebookShareButton>
          </div>
          <div className="sharebutton">
            <TwitterShareButton
              url={url}
              quote={quote}>
              <TwitterIcon
                size={32}
              square />
            </TwitterShareButton>
          </div>
          <div className="sharebutton">
            <GooglePlusShareButton
              url={url}
              quote={quote}>
              <GooglePlusIcon
                size={32}
              square />
            </GooglePlusShareButton>
          </div>
          <DialogContentText className="levelEndText">
            Have You Screamed Enough?
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            I'm Finished
          </Button>
          <Button onClick={this.handleStartOver} color="primary">
            Start Over
          </Button>
        </DialogActions>
      </Dialog>
    )

    return this.state.payload.score >= 100 ? passed : failed;
  }
}
