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

import axios from 'axios';


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
    this.handleScore = this.handleScore.bind(this)
  };

  handleOpen() {
    this.setState({
      open: true
    })
  }

  handleClose() {
    this.setState({
      open: false
    })
  }

  handleNextLevel() {
    //change the state of HighStriker to go up to the next level
    this.props.nextLevel();
  }

  handleScore() {
    var personalBest = this.props.user.personalBest
    const currentScore = this.props.currentScore
    //check to see if user current score is greater than users high score
      //if true post new high score to database
    if (currentScore > personalBest) {
      axios({
        method:'POST',
        url:'/addScore',
        data: {
          user: this.props.user,
          score: currentScore
        }
      }).then(function(result) {
      })
    }
  }

  handleStartOver() {
    //change the state of HighStriker to go back to the first level
    this.props.startOver();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      payload: nextProps.payload
    })
  }

  render () {
    const url = window.location.href;
    const currentScore = this.props.currentScore;
    const quote = 'I Got to Level '+currentScore+'. Think You Can Beat Me?'
    const score = this.state.payload.score;

    const passed = (
      <Dialog open={this.state.open}>
        <DialogTitle>{"You've Passed Level "+currentScore+"!"}</DialogTitle>
        <DialogContent>
          <div className="score"> Score: {score} </div>
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
              title={quote}>
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
        <Button onClick={() => {
            this.handleClose();
            this.handleScore();
            }}
            color="primary">
            Try Again
          </Button>
          <Button onClick={
            () => {
              this.handleNextLevel();
              this.handleScore();
              this.handleClose();
                }}
              color="primary">
              Next Level
          </Button>
        </DialogActions>
      </Dialog>
    );


    const failed = (
      <Dialog open={this.state.open}>
        <DialogTitle>{"You didn't pass this level"}</DialogTitle>
        <DialogContent>
          <div className="score"> Score: {score} </div>
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
              title={quote}>
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
          <Button onClick={() => {
              this.handleClose();
              this.handleScore();
              }}
              color="primary">
            Try Again
          </Button>
          <Button onClick={ () => {
              this.handleStartOver();
              this.handleScore();
              this.handleClose();}
              }
              color="primary">
              Start Over
          </Button>
        </DialogActions>
      </Dialog>
    )

    return this.state.payload.score >= 100 ? passed : failed;
  }
}
