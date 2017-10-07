import React from 'react';
import {Col} from 'react-bootstrap';
import Grid from 'material-ui/Grid'

const Images = (props) => (
	<Grid item xs={12} container={true} justify={'center'}>
		{props.scream ? <img className='pics' src="../models/vegetass.gif" alt="dancing cat" /> :
    <img className='pics' src="../models/MasterRoshi.jpg"/>}
  </Grid>
)

export default Images;
