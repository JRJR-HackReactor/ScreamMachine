import React from 'react';
import Recorder from './Recorder.js';

import Confetti from 'react-dom-confetti';
import Button from 'material-ui/Button';

const confettiConfig = {
  angle: 90,
  spread: 186,
  startVelocity: 17,
  elementCount: 102,
  decay: 0.96
};

const style = {
  striker: {
    background: 'linear-gradient(to bottom, #9be2fe 0%, #67d1fb 100%)',
    paddingTop: 20,
    marginBottom: 20
  },
  machine: {
    position: 'relative',
    display: 'block',
    height: 550,
    backgroundColor: 'yellow',
    width: 100,
    margin: 'auto'
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
    backgroundColor: 'red',
    borderRadius: 100,
    marginLeft: -10,
    textAlign: 'center',
    verticalAlign: 'middle',
    display: 'grid',
    boxShadow: 'rgba(247, 10, 10, 0.2) 0px 2px 4px 2px'
  },
  volume: {
    color: 'white',
    fontSize: 30
  },
  startBtn: {
    fontSize: 25,
    margin: 'auto',
    display: 'block',
    padding: 5
  }
}

class HighStriker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'stop',
      volume: 0,
      confetti: false
    }
  }

  startRecording() {
    var timeout = setTimeout(this.stopRecording.bind(this), 3000);
    this.setState({
      status: 'start',
      timeout
    });
  }

  stopRecording() {
    this.setState({
      status: 'stop',
      confetti: false
    });
    this.props.setOpenLevelEnd(true, {score: this.state.volume});
  }

  volumeListener(volume) {
    if (volume >= 100) {
      volume = 100;
      this.setState({
        volume: volume,
        confetti: true
      });
      clearTimeout(this.state.timeout);
      this.stopRecording();
    } else {
      this.setState({
        volume: volume
      });
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="striker" style={style.striker}>
        <Recorder ref="recorder" sensitivity={4} status={this.state.status} volumeListener={this.volumeListener.bind(this)} />
        <div style={style.machine}>
          <div style={style.bell}>
            <Confetti className="confetti" active={this.state.confetti} config={confettiConfig} />
            <div style={style.volume}>{this.state.volume}</div>
          </div>
          <input style={style.slider} type="range" min="0" max="100" value={this.state.volume} />
        </div>
        <Button onClick={this.startRecording.bind(this)} color="primary">
          Start
        </Button>
      </div>
    )
  }
}

export default HighStriker;
