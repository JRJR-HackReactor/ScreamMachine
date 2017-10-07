import React, {Componenet} from 'react';
import {LineChart} from 'react-d3-basic';
import axios from 'axios';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';

const styles = {
  title: {
    textAlign: 'center',
    fontSize: 32
  },
  body: {
    textAlign: 'center',
    fontSize: 16
  },
  card: {
    maxWidth: 300,
    height: 125
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  cardBody: {
    textAlign: 'center',
    fontSize: 14
  },
  highStress: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: 'rgb(250, 72, 4)',
    paddingTop: 5
  },
  averageStress: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: 'rgb(222, 227, 2)',
    paddingTop: 5
  },
  lowStress: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: 'rgb(115, 187, 5)',
    paddingTop: 5
  }
}


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
	       user: this.props.user.username
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
      	color: '#bfbe1a'
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
    const stressLevel = this.state.stressLevel >=8  ? styles.highStress : (this.state.stressLevel > 5.5 && this.state.stressLevel <8) ? styles.averageStress : styles.lowStress;

    return (
      <Grid container spacing={24}>
      	<Grid item xs={12}><Typography type="title" style={styles.title}>Hi {this.props.user.username}!</Typography></Grid>
        <Grid item xs={12}>
          <Grid item container justify={'center'} spacing={16}>
            <Grid item>
              <Card style={styles.card} raised={true}>
                <CardContent>
                  <Typography type="headline" component="h2" style={styles.cardTitle}>
                    Top Stress Factors
                  </Typography>
                  <Typography type="body1" style={styles.cardBody}>
                    {this.state.top.people}
                  </Typography>
                  <Typography type="body1" style={styles.cardBody}>
                    {this.state.top.places}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card style={styles.card} raised={true}>
                <CardContent>
                  <Typography type="headline" component="h2" style={styles.cardTitle}>
                    Stress Score
                  </Typography>
                  <Typography type="body1" style={stressLevel}>
                    {this.state.stressLevel}
                  </Typography>
                </CardContent>
              </Card>
              </Grid>
              </Grid>
        </Grid>
      	<Grid item xs={12} container justify={'center'} style={{paddingTop: 45}}>
      	    <LineChart showXGrid={false} showYGrid={false} title={'Scream Volumes'} data={this.state.screams} width={700} height={300} chartSeries={chartSeries1} x={x} />
      	</Grid>
      	<Grid item xs={12} container justify={'center'} style={{paddingTop: 45}}>
      	    <LineChart showXGrid={false} showYGrid={false} title={'Scream Frequency'} data={this.state.screams} width={700} height={300} chartSeries={chartSeries2} x={x} />
      	</Grid>
      </Grid>
    );
  }
}

export default Profile;
