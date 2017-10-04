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
import Radio, { RadioGroup } from 'material-ui/Radio';
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography';
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

	stressLevel(e) {
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
			<form onSubmit={this.submit}>
				<Typography type='title'> Who did you hangout with today? </Typography>
					{peopleCheckbox}
				<Typography type='title'> Where where you today? </Typography>
					{placeCheckbox}
				<Typography type='title'> How stressed were you today? </Typography>
				<RadioGroup value={this.state.stressLevel} onChange={this.stressLevel}>
					<FormControlLabel control={<Radio value='0' name='stressLevel'/>} label='0' />
					<FormControlLabel control={<Radio value='1' name='stressLevel'/>} label='1' />
					<FormControlLabel control={<Radio value='2' name='stressLevel'/>} label='2' />
					<FormControlLabel control={<Radio value='3' name='stressLevel'/>} label='3' />
					<FormControlLabel control={<Radio value='4' name='stressLevel'/>} label='4' />
					<FormControlLabel control={<Radio value='5' name='stressLevel'/>} label='5' />
					<FormControlLabel control={<Radio value='6' name='stressLevel'/>} label='6' />
					<FormControlLabel control={<Radio value='7' name='stressLevel'/>} label='7' />
					<FormControlLabel control={<Radio value='8' name='stressLevel'/>} label='8' />
					<FormControlLabel control={<Radio value='9' name='stressLevel'/>} label='9' />
					<FormControlLabel control={<Radio value='10' name='stressLevel'/>} label='10' />
				</RadioGroup>
				<Button raised type='submit'> Submit </Button>
			</form>
		)}

}

window.formOptions = {
	people: ['close family', 'extended family', 'friends', 'co-workers', 'ex-SO'],
	places: ['work', 'school', 'gym', 'outside for more than an hour','bar']
}

export default StressForm;
