import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Card, {CardContent, CardHeader} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListItemText, ListItemAvatar } from 'material-ui/List';
import { withTheme } from 'material-ui/styles';
import HighScore from './HighScore.jsx'


class HighScores extends React.Component {
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
      }
    }

    return (
      <div>
        <Card style={styles.card}>
          <CardHeader title="HIGH SCORES"/>
          <CardContent>
            <Paper>
              {this.props.highScores.map((highScore, i) => (
                <HighScore key={i} highScore={highScore}/>
              ))}
            </Paper>
          </CardContent>
        </Card>
      </div>
    )
  };
};

export default withTheme()(HighScores)
