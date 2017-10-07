import React from 'react';
import Recorder from './Recorder.js';
import Confetti from 'react-dom-confetti';
import Button from 'material-ui/Button';
import { withTheme } from 'material-ui/styles';

const confettiConfig = {
  angle: 180,
  spread: 360,
  startVelocity: 31,
  elementCount: 200,
  decay: 0.94,
  ticks: 450
};

class HighStriker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'stop',  //controls the recorder
      volume: 0,
      confetti: false, //toggles the confetti
      countdownNumber: null
    }
  }

  //triggered when 'Start' button is clicked
  startRecording() {
    //show the countdown container
    this.refs.countdown.style.opacity = 1;
    this.refs.bell.className = '';

    //set the volume back to 0
    this.setState({
      volume: 0
    })

    var countdown = (number) => {
      //set the countdown number to display
      this.setState({
        countdownNumber: number
      });

      //if number is 0 then fade out the countdown container
      if (number === 0) {
        //set timeout to stop recording after 3 seconds
        var timeout = setTimeout(this.stopRecording.bind(this), 3000);
        //update state to start recording, save the timeout ref, and clear the countdown number
        this.setState({
          status: 'start',
          timeout,
          countdownNumber: null
        });
        //hide the countdown container
        this.refs.countdown.style.opacity = 0;
      } else {
        //set a 1 second timeout to call 'countdown' on the number - 1
        setTimeout(() => {
          countdown(number-1);
        }, 1000);
      }
    }

    //start countdown at 3
    countdown(3);
  }

  //stop the recorder, reset the confetti cannon, and open the LevelEnd modal
  stopRecording() {
    this.setState({
      status: 'stop',
      confetti: false
    });
    //open the level end modal and pass it the volume/score
    this.props.setOpenLevelEnd(true, {score: this.state.volume});
  }

  //runs when the volume is updated
  volumeListener(volume) {
    //if volume over 100 set it to 100
    if (volume >= 100) {
      volume = 100;
      this.setState({
        volume: volume,
        confetti: true
      });
      this.refs.bell.className = 'ring';
      //stop the timeout from startRecording
      clearTimeout(this.state.timeout);
      this.stopRecording();
    } else {
      //set the volume on the state
      this.setState({
        volume: volume
      });
    }
  }

  render() {
    const background = this.props.theme.palette.secondary[200]

    const style = {
      striker: {
        background: background,
        paddingTop: 20,
        marginBottom: 20,
        position: 'relative',
        height: 625,
        borderRadius: 2,
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
      },
      machine: {
        position: 'relative',
        display: 'block',
        height: 550,
        backgroundColor: '#ffe401',
        width: 100,
        margin: 'auto',
        borderRadius: 2
      },
      slider: {
        width: 400,
        transformOrigin: '200px 200px',
        transform: 'rotate(-90deg)',
        position: 'relative',
        top: 0,
        left: 35,
        backgroundColor: 'transparent'
      },
      bell: {
        width: 120,
        height: 120,
        backgroundColor: '#ed1b24',
        borderRadius: 100,
        marginLeft: -10,
        textAlign: 'center',
        display: 'block',
        boxShadow: 'rgba(247, 10, 10, 0.2) 0px 2px 4px 2px'
      },
      volume: {
        color: 'white',
        fontSize: 30,
        position: 'relative',
        top: 'calc(50% - 20px)'
      },
      startBtn: {
        fontSize: 25,
        margin: 'auto',
        display: 'block',
        padding: 5,
        width: 100
      },
      countdown: {
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'table',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.35)',
        pointerEvents: 'none',
        transition: 'all 0.25s linear',
        opacity: 0
      },
      number: {
        verticalAlign: 'middle',
        textAlign: 'center',
        display: 'table-cell',
        fontSize: 180,
        color: 'white'
      }
    }
    //set the sensitivity based on the level/currentScore
    const sensitivity = 3 + (this.props.currentScore * 0.1);

    return (
      <div className="striker" style={style.striker}>
        <Recorder ref="recorder" sensitivity={sensitivity} status={this.state.status} volumeListener={this.volumeListener.bind(this)} />
        <div style={style.machine}>
          <div ref="bell" style={style.bell}>
            <Confetti className="confetti" active={this.state.confetti} config={confettiConfig} />
            <div style={style.volume}>{this.state.volume}</div>
          </div>
          <input style={style.slider} type="range" min="0" max="100" value={this.state.volume} />
        </div>
        <Button raised color="primary" style={style.startBtn} onClick={this.startRecording.bind(this)}>
          Start
        </Button>
        <div ref="countdown" style={style.countdown}>
          <div style={style.number}>
            {this.state.countdownNumber}
          </div>
        </div>
      </div>
    )
  }
}

export default withTheme()(HighStriker);
