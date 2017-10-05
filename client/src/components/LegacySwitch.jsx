import React from 'react';
import Switch from 'material-ui/Switch';
import PropTypes from 'prop-types';
import { FormControlLabel } from 'material-ui/Form';
import green from 'material-ui/colors/green';

export default class LegacySwitch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showLegacy: false
    }
    const showLegacy = props.showLegacy
    console.log(showLegacy)
  }

  render() {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={this.state.showLegacy}
            onChange={ () => {
              this.props.showLegacy();
              this.setState({ showLegacy: !this.state.showLegacy });
              }
            }
          />
        }
        label="LEGACY APP"
      />
    )
  }
}
