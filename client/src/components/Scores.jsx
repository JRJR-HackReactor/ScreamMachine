import React from 'react';
import Card, {CardHeader, CardContent} from 'material-ui/Card';
import Grid from 'material-ui/Grid';

const style = {
  card: {
    backgroundColor: '#36bfc7',
    textAlign: 'center'
  }
}

class Scores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userHighScore: 1,
      highScores: []
    }
  }

  // changeScore() {
  //   this.setState({
  //     userHighScore: //something??
  //   });
  // }

  render() {
    return(
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            {this.props.user ?
              <Card style={style.card}>
                <CardHeader title="Your HIGHEST Score!"/>
                <CardContent>{this.props.user.personalBest}</CardContent>
              </Card>
              :
              <Card style={style.card}>
                <CardHeader title="Your HIGHEST Score!"/>
                <CardContent>1</CardContent>
              </Card>
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card style={style.card}>
              <CardHeader title="Other Peoples High Score!"/>
              <CardContent>2</CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  };
};

export default Scores;
