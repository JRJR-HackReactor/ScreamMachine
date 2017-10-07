import React from 'react';
import Card, {CardHeader, CardContent, CardMedia} from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Chip from 'material-ui/Chip';
import { withTheme } from 'material-ui/styles';
import { yellow } from 'material-ui/colors';

class CurrentScore extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {

    const { theme } = this.props;
    const primary = theme.palette.primary[500];
    const accent = theme.palette.secondary[200];


    const styles = {
      card: {
        backgroundColor: primary,
        textAlign: 'center',
        height: 625
      },
      chip: {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: 'auto',
        textAlign: 'center'
      },
      title: {
        color: accent,
        lineHeight: '38px'
      },
      carnival: {
        fontFamily: 'circusregular',
        fontSize: '44px',
        textAlign: 'center',
        backgroundColor: yellow[500]
        // margin: 20
      },
      logo: {
        backgroundColor: 'transparent',
        height: 200
      },
      scores: {
        backgroundColor: primary,
        height: 425
      }
    }

    return (
      console.log('CURRENT SCORE PROPS: ', this.props),
      <div>
        <Card style={styles.card} >
          <Card style={styles.logo}>
            <div style={styles.carnival} >
              <CardContent>
                <span style={styles.title}>CARNIVAL SCREAM MACHINE</span>
              </CardContent>
            </div>
          </Card>
          {this.props.user ?
            <Card style={styles.scores}>
              <CardHeader title="CURRENT LEVEL"/>
                <Chip style={styles.chip} label={this.props.currentScore} />
              <CardHeader title="HIGHEST LEVEL"/>
                <Chip style={styles.chip} label={this.props.user.personalBest} />
            </Card>
            :
            <Card style={styles.scores}>
              <CardHeader title="Your Current Score!"/>
              <Chip style={styles.chip} label={this.props.currentScore} />
            </Card>
          }
        </Card>
      </div>
    )
  };
};


export default withTheme()(CurrentScore)
