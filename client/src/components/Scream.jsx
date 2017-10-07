import React from 'react';
import sketch, {getMic, getFreq} from '../../models/micGraph';
import ScreamButton from './ScreamButton.jsx';
import Images from './Images.jsx';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Resources from './Resources.jsx';
import axios from 'axios';
import P5Wrapper from 'react-p5-wrapper';

class Scream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scream: false,
      screamButtonText: 'Start',
      saveButtonText: 'Save Scream',
      mic: null,
      freqArray: [0,0,0],
      displayScore: false,
      screamLevel: 0,
      micRounds: 0
    };
    this.toggleClick = this.toggleClick.bind(this);
    this.micHandler = this.micHandler.bind(this);
    this.saveScream = this.saveScream.bind(this);
    setTimeout(this.micHandler,250);
  }

  micHandler() {
    this.setState({mic:getMic()});
    var freq = getFreq();
    this.state.freqArray[0] += freq[0];
    this.state.freqArray[1] += freq[1];
    this.state.freqArray[2] += freq[2];
    this.state.micRounds++;
    var micLevel = this.state.mic.getLevel();
    if(micLevel > this.state.screamLevel) {
      this.setState({screamLevel: micLevel});
    }
    //console.log(micLevel); // for debugging
    if	(this.state.scream) {
      //console.log(micLevel); // for debugging
      if (micLevel < 0.10) {
        this.setState({scream: false});
      }
    } else if (micLevel > 0.10) {
      this.setState({scream: true})
    }
    if(this.state.screamButtonText === 'Stop') {
      setTimeout(this.micHandler, 250);
    }
  }

  saveScream() {
    if (this.props.user.username !== null) {
      var context = this;
      axios.post('/addScream', {
        params: {
          volume: context.state.screamLevel,
          username: context.props.user.username,
          lowFreq: context.state.freqArray[0]/context.state.micRounds,
          midFreq: context.state.freqArray[1]/context.state.micRounds,
          highFreq: context.state.freqArray[2]/context.state.micRounds
        }
      })
        .then((res) => {
          context.setState({
            freqArary: [0,0,0],
            micRounds: 0,
            saveButtonText: 'Saved'
          });
        })
        .catch(function(error) {
          console.log('App.jsx, Failed to save: ', error);
        });
    } else if (this.props.user === null) {
      alert('Please log in to save your scream.');
    }
  }

  //scream button controller
  toggleClick(e) {
    e.preventDefault();
    //if button text is 'Start' or 'Scream Again'
    if (this.state.screamButtonText === 'Start' || this.state.screamButtonText === 'Scream Again') {
      //set button text to 'Stop'
      this.setState({screamButtonText: 'Stop'});
      this.setState({saveButtonText: 'Save Scream'});
      this.setState({displayScore: false});
      this.setState({screamLevel: 0});
      this.state.mic.start();
      setTimeout(this.micHandler,100);
      //else if button text is 'Stop'
    } else if (this.state.screamButtonText === 'Stop') {
      //set button text to 'Scream Again'
      this.setState({screamButtonText: 'Scream Again'});
      //display highest volume
      this.setState({displayScore: true})
      this.state.mic.stop();
    }
  }

  render() {
    const size = {
      width: '50%',
      height: 500,
    };
    const view = 'list'; // or 'coverart'
    const theme = 'black'; // or 'white'
    return (
      <div>
        <Grid item className='pagetext'>
          {this.state.screamButtonText === 'Scream Again' ? <div></div> :
            <Grid>Wow, You Look STRESSED! Go Ahead and Scream. You'll Feel Better.</Grid>
          }
        </Grid>
        <div>
          <Grid container={true} justify={'center'} className='gif'>
            {this.state.displayScore ?
                <div>
                  <Grid spacing={24} container={true} style={{paddingLeft: 100}}>
                    <Grid item xs={8}>
                      <div id='screamscore'> Score: {Math.floor(this.state.screamLevel * 1000)} </div>
                      <Button raised id='saveButton' style={{backgroundColor: '00BCD4'}} onClick={this.saveScream}>
                        {this.state.saveButtonText}
                      </Button>
                      <div id='clickPlay'>Still feeling stressed? Click 'play'!</div>
                      <audio id='afterFreeman' controls="controls">
                        <source src='../../hlfreeman.wav'/>
                      </audio>
                  </Grid>
                  <Grid item xs={4} style={{paddingRight: 25}}>
                    <Resources />
                  </Grid>
                </Grid>
              </div>
              :
                <Images scream={this.state.scream}/>
              }
          </Grid>
        </div>
        <div>
          <Grid item xs={12} justify={'center'} container={true}>
            <ScreamButton func={this.toggleClick} state={this.state.screamButtonText}/>
          </Grid>
        </div>
          <Grid item xs={12} justify={'center'} container={true} id='ScreamMeter'>
            <Paper elevation={8}>
              <P5Wrapper sketch={sketch} />
            </Paper>
          </Grid>
      </div>


    )
  }
}

export default Scream;
