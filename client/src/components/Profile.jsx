import React, {Componenet} from 'react';
import {LineChart} from 'react-d3-basic';
import axios from 'axios';
import {Grid, Row, Col} from 'react-bootstrap';


class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      screams: [],
      stressLevel: 0,
      top: []
    }
    this.getScreams = this.getScreams.bind(this);
    this.getScreams();
    this.getAverage();
  }

  getScreams() {
    axios.get('/getScream', {
      params: {
	user: this.props.user
      }
    })
      .then( (screams) => {
	this.setState({screams: screams.data});
      })
  }

  getAverage() {
    axios.get('/getAverage')
    .then ( (result) => {
    	this.setState({stressLevel: result.data.stress_level});
    	if (result.data.length !== 0) {
    	  var averageData = JSON.parse(result.data.form_data);
    	  var newState = {};
    	  for(var key in formOptions) {
    	    var highest = 0;
    	    averageData[key].forEach( (el,i) => {
    	      if (el > highest) {
          		newState[key] = formOptions[key][i];
          		highest = el;
    	      }
    	    })

    	    if (newState[key] === undefined) {
    	      newState[key] = 'None';
    	    }
    	  }
    	  this.setState({top:newState});
    	}
      })
  }

  render() {
    // chart series,
    // field: is what field your data want to be selected
    // name: the name of the field that display in legend
    // color: what color is the line
    var chartSeries1 = [
      {
      	field: 'volume',
      	name: 'Volume',
      	color: '#ff7f0e'
      }
    ];

    var	chartSeries2 = [
      {
      	field: 'lowfreq',
      	name: 'Low Frequency',
      	color: '#cabb6e'
      },
      {
      	field: 'midfreq',
      	name: 'Mid Frequency',
      	color: '#123456'
      },
      {
      	field: 'highfreq',
      	name: 'High Frequency',
      	color: '#654321'
      }
    ];
    // your x accessor
    var x = function(d) {
      return d.id;
    };
    // have to hard code top
    return (
      <Grid>
      	<Row> <h1> Hi {this.props.user} </h1> </Row>
      	<Row> Your average stress level is {this.state.stressLevel} </Row>
      	<Row> We have analzyed your data and think your top stressors are hanging out with <b> {this.state.top.people} </b> and  going to <b>{this.state.top.places}</b> </Row>
      	<Row>
      	  <Col md={8} mdOffset={2}>
      	    <LineChart showXGrid={false} showYGrid={false} title={'Scream Volumes'} data={this.state.screams} width={700} height={300} chartSeries={chartSeries1} x={x} />
      	  </Col>
      	</Row>
      	<Row>
      	  <Col md={8} mdOffset={2}>
      	    <LineChart showXGrid={false} showYGrid={false} title={'Scream Frequency'} data={this.state.screams} width={700} height={300} chartSeries={chartSeries2} x={x} />
      	  </Col>
      	</Row>
      </Grid>
    );
  }
}

export default Profile;
