var mic;
var fft;

var s = function(p) {

  p.setup = function() {
    p.createCanvas(500,250);
    p.noStroke();
    p.fill(0,255,255);
    mic = new p5.AudioIn();
    fft = new p5.FFT();
    fft.setInput(mic);
  }

  p.draw = function() {
    p.background(200);
    var spectrum = fft.analyze();
    p.noStroke();
    p.fill(0,255,0); // spectrum is green
    for (var i = 0; i< spectrum.length; i++){
      var x = p.map(i, 0, spectrum.length, 0, p.width);
      var h = -p.height + p.map(spectrum[i], 0, 255, p.height, 0);
      p.rect(x, p.height, p.width / spectrum.length, h )
    }
    var waveform = fft.waveform();
    p.noFill();
    p.beginShape();
    p.stroke(255,0,0); // waveform is red
    p.strokeWeight(2);
    for (var i = 0; i< waveform.length; i++){
      var x = p.map(i, 0, waveform.length*0.2, 0, p.width);
      var y = p.map( waveform[i]*0.5, -1, 1, 0, p.height);
      p.vertex(x,y);
    }
    p.endShape();
  }
};

export var getFreq = function() {
  var ret = [];
  ret.push(fft.getEnergy('lowMid'));
  ret.push(fft.getEnergy('mid'));
  ret.push(fft.getEnergy('highMid'));
  return ret;
}

export var getMic = function() {
  return mic;
};

export default s;
// ScreamMeter is the id that the graph is placed on
