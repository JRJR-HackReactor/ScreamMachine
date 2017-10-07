import React from 'react';
import Card, {CardHeader, CardContent, CardMedia} from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Chip from 'material-ui/Chip';
import { withTheme } from 'material-ui/styles';
import { yellow } from 'material-ui/colors';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import List, {ListItem} from 'material-ui/List';

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
        lineHeight: '38px',
        /* This is mostly intended for prototyping; please download the pattern and re-host for production environments. Thank you! */
      },
      titleContent: {
        backgroundColor: yellow[500]
      },
      // carnival: {
      //   fontFamily: 'carnevalee',
      //   fontSize: '52px',
      //   textAlign: 'center',
      //   // backgroundColor: yellow[500]
      //   // margin: 20
      // },
      logo: {
        backgroundColor: primary,
        height: 200,
        fontFamily: 'carnevalee',
        fontSize: '52px',
        textAlign: 'center',
      },
      scores: {
        backgroundColor: primary,
        height: 425
      },
      paper: {
        backgroundColor:  yellow[500]
      }
    }

    return (
      <div>
        <Card style={styles.card} >
          <Card style={styles.logo}>
            <CardContent style={styles.titleContent}>
              <span style={styles.title}>CARNIVAL SCREAM MACHINE</span>
            </CardContent>
          </Card>
          {this.props.user ?
            <Card style={styles.scores}>
              <Paper style={styles.paper}>
                <List>
                  <div>
                    <ListItem >
                      <CardHeader title="CURRENT LEVEL"/>
                      <CardContent >
                        <Chip style={styles.chip} label={this.props.currentScore} />
                      </CardContent>
                    </ListItem>
                  </div>
                <Divider />
                  <div>
                    <ListItem>
                      <CardHeader title="HIGHEST LEVEL"/>
                      <CardContent>
                        <Chip style={styles.chip} label={this.props.user.personalBest} />
                      </CardContent>
                    </ListItem>
                  </div>
                </List>
              </Paper>
            </Card>
            :
            <Card style={styles.scores}>
              <Paper style={styles.paper}>
                <CardHeader title="Your Current LEVEL!"/>
                <Chip style={styles.chip} label={this.props.currentScore} />
              </Paper>
            </Card>
          }
        </Card>
      </div>
    )
  };
};


export default withTheme()(CurrentScore)
