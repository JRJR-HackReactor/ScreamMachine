import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';
import Switch from 'material-ui/Switch'
import Input, { InputLabel } from 'material-ui/Input';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import axios from 'axios';



class StressForm extends React.Component {
	constructor(props) {
		super(props);
		var selectedOptions = {};
		for(var key in formOptions) {
			selectedOptions[key] = formOptions[key].map( (el) => {
				return null;
			})
		}

		this.state = {
			stressLevel: 0,
			selectedOptions: selectedOptions
		}

		this.addChecked = this.addChecked.bind(this);
		this.submit = this.submit.bind(this);
		this.stressLevel = this.stressLevel.bind(this);
	}

	submit(e) {
		e.preventDefault();
		var isFirst = false;
		// make request to get data from database
		// if no data create empty one
		var stressors = JSON.stringify(this.state.selectedOptions);
		axios.post('/addForm', {
			params: {
				username: this.props.user,
				stress_level: this.state.stressLevel,
				stressors: stressors
			}
		}).then( (error) => {
			axios.get('/getAverage')
				.then( (result) => {
					// if first form data
					if (result.data.length === 0) {
						isFirst = true;
						// we don't have an avgStess the first time, so we set it to current
						var avgStress = this.state.stressLevel;
						// make a object with 0's in every element of the array since there is no old data
						var oldData = {};
						for(var key in this.state.selectedOptions) {
								oldData[key] = this.state.selectedOptions[key].map( (el) => {
								return 0;
							})
						}
					} else {
						var avgStress = result.data.stress_level;
						var oldData = JSON.parse(result.data.form_data);
					}
					// takes selected options and adds them to the average for the user (using stessLevel)
					var newAvg = {};
					for (var key in oldData) {
						newAvg[key] = [];
						oldData[key].forEach( (el,i) =>{
							if(this.state.selectedOptions[key][i] !== null) {
								var num;
								if (el === null) {
								//for first case
									num = this.state.stressLevel;
								} else {
								// get average
									num = (el + this.state.stressLevel)/2;
								}
							} else {
								num = el;
							}
							newAvg[key].push(num);
						})
					}
					var newStress = (this.state.stressLevel + avgStress)/2;
					axios.post('/addAverages', {
						params: {
							username: this.props.user,
							stress_level: newStress,
							form_data: JSON.stringify(newAvg),
							isFirst: isFirst
						}
					})
						.then( () =>{
							this.props.func();
						})
				})
		})
	}

	addChecked(e) {
		var newState = {};
		var selectedEl = e.target.value;
		for(var key in formOptions) {
			newState[key] = this.state.selectedOptions[key].slice();
			var index = formOptions[key].indexOf(selectedEl);
			if (index !== -1) {
				if (newState[key][index] === null) {
					newState[key][index] = formOptions[key][index];
				} else {
					newState[key][index] = null;
				}
			}
		}
		this.setState({selectedOptions: newState});
	}

	stressLevel(e, value) {
		this.setState({stressLevel: parseInt(e.target.value)});
	}

	render(props) {

		// need to do this for all catagories because you need to added text to display for the user
		var peopleCheckbox = formOptions.people.map( (el,i) => {
			return <FormControlLabel control={<Checkbox onChange={this.addChecked} value={el} key={i} />} label={el} key={i}/>
		})
		var placeCheckbox = formOptions.places.map( (el, i) => {
			return <FormControlLabel control={<Checkbox onChange={this.addChecked} value={el} key={i} />} label={el} key={i}/>
		})

		return (
			<div>
			<form onSubmit={this.submit} id='stressform'>
				<Typography type='title' className="formtitle"> Who did you hangout with today? </Typography>
					{peopleCheckbox}
				<Typography type='title' className="formtitle"> Where where you today? </Typography>
					{placeCheckbox}
				<Typography type='title' className="formtitle"> How stressed were you today? </Typography>

				<Select
					native
					value={this.state.stressLevel}
					onChange={this.stressLevel}
					>
						<option value='0'>0</option>
						<option value='1'>1</option>
						<option value='2'>2</option>
						<option value='3'>3</option>
						<option value='4'>4</option>
						<option value='5'>5</option>
						<option value='6'>6</option>
						<option value='7'>7</option>
						<option value='8'>8</option>
						<option value='9'>9</option>
						<option value='10'>10</option>
				</Select>
				<div id="formsubmit">
					<Button raised type='submit'> Submit </Button>
				</div>
			</form>
				</div>
		)}

}

window.formOptions = {
	people: ['Close Family', 'Extended Family', 'Friends', 'Co-Workers', 'Ex-SO'],
	places: ['Work', 'School', 'Gym', 'Outside For More Than an Hour','Bar']
}

export default StressForm;
