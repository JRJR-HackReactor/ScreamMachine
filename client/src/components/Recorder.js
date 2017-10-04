import React from 'react';

class Recorder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      volume: 0
    };

    this.volume = 0;
    this.recording = false;

    this.soundAllowed = (stream) => {
      this.stream = stream;

      //Audio stops listening in FF without // window.persistAudioStream = stream;
      //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
      //https://support.mozilla.org/en-US/questions/984179
      window.persistAudioStream = stream;
      this.audioContent = new AudioContext();
      var audioStream = this.audioContent.createMediaStreamSource(stream);
      var analyser = this.audioContent.createAnalyser();
      audioStream.connect(analyser);
      analyser.fftSize = 1024;

      var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

      //Through the frequencyArray has a length longer than 255, there seems to be no
      //significant data after this point. Not worth visualizing.
      var total = 0;
      var getVolume = () => {
        analyser.getByteFrequencyData(frequencyArray);
        var total = 0;
        for (var i = 0; i < 255; i++) {
          total += frequencyArray[i];
        }
        if (props.sensitivity) {
          total = (total / (props.sensitivity * 100));
        }
        var volume = Math.round(total);
        this.setState({volume: volume});
        this.volume = volume;
        if (props.volumeListener) {
          props.volumeListener(volume);
        }
      }

      this.interval = setInterval(getVolume, 50);
    }

    this.soundNotAllowed = function(error) {
      console.error("You must allow your microphone.");
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || null;

    this.start = () => {
      if (!this.recording){
        navigator.getUserMedia({
          audio: true
        }, this.soundAllowed, this.soundNotAllowed);
        this.recording = true;
      }
    }

    this.stop = () => {
      if (this.recording){
        this.stream.getAudioTracks().forEach(function(track) {
          track.stop();
        });
        clearInterval(this.interval);
        this.audioContent.close();
        this.recording = false;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'start') {
      this.start();
    } else if (nextProps.status === 'stop') {
      this.stop();
    }
  }

  render() {
    return (
      <div>
        {this.props.render(this.state.volume)}
      </div>
    )
  }
}

export default Recorder;
