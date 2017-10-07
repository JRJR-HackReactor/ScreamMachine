import React from 'react';
import Card, {CardHeader, CardContent, CardMedia} from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import { withTheme } from 'material-ui/styles';
import HighScores from './HighScores.jsx';
import Typography from 'material-ui/Typography';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import Title from './Title.jsx';
import CurrentScore from './CurrentScore.jsx';

class Scores extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.props;
    const primary = theme.palette.primary[500];
    const accent = theme.palette.secondary[200];

    const styles = {
      card: {
        backgroundColor: accent,
        textAlign: 'center',
      },
      cardContent: {
        fontSize: '36px'
      },
      chip: {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '2px',
        textAlign: 'center',
        margin: 'auto'
      },
      carnival: {
        fontFamily: 'circusregular',
        fontSize: '44px',
        textAlign: 'center',
        backgroundColor: accent
      },
      title: {
        color: theme.palette.primary[500],
        lineHeight: '38px'
      }
    }

    return (
      console.log('SCORES PROPS: ', this.props),
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={12}>
            <Title />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CurrentScore user={this.props.user} currentScore={this.props.currentScore}/>
          </Grid>
          <Grid item xs={12} sm={12}>
            <HighScores highScores={this.props.highScores}/>
          </Grid>
        </Grid>
      </div>
    )
  };
};

export default withTheme()(Scores);
