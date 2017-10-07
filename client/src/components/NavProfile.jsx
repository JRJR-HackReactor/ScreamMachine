import React from 'react'
import Select from 'material-ui/Select'
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class NavProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    var newValue = e.target.value;
    this.setState({
      value: newValue
    })

    this.props.navHandler(newValue)
    this.setState({
      value: ''
    })

  }

  render (){
    return (
          <Select
            native
            value={this.state.value}
            onChange={this.handleChange}
          >
            <option>Select Page</option>
            <option value="Legacy">Home</option>
            <option value="Profile">Your Graphs</option>
            <option value="StressForm">Stress Form</option>
          </Select>
    )
  }
}

export default withStyles(styles)(NavProfile);
