import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import {
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
		Button as ButtonCore,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import { list, post } from "../../../crud/api";
import Select from 'react-select';



class Create extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			city:{is_active: 0},
			validated: false,
			action:'',
			states:[],
			state:{label:'Select State', value:0},
			fields: {},
      		errorsf: {}
		};

		//this.getStates();
		this.loadModels();
	}

	loadModels() {
		let models = {
			'AbStates':{},
		}
		post('abmodels', {models:models}).then(function(response){
			for(let opt in response.data){
				response.data[opt].map((row, i) => {
					response.data[opt][i].label = row.name;
					response.data[opt][i].value = row.id;
				})
			}
			this.setState({
				states:response.data.AbStates,
			})
		}.bind(this))
  	}
	selectState(value, key) {
		let city = this.state.city;
		city.state = value && value.value ? value.value : '';
		this.setState({ [key]: value ? value : '', city: city});
	}

	handleChange(event) {
		var city = this.state.city;
		var attr = event.target.name;
		var val = event.target.value;
		if(attr === 'is_active')
			val = parseInt(val);
		city[attr] = val;
		this.setState({city : city})

		let fields = this.state.fields;
    	fields[attr] = val;
    	this.setState({fields});
	}

	handleSubmit(event) {
		const form = event.currentTarget;
		event.preventDefault();
		event.stopPropagation();
		if(this.handleValidation()) {
			this.setState({validated: true});
			post('cities', this.state.city).then(
				(response) => {
					this.setState({city: response.data});
					this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm("city_form") : "/admin/cities");
				}).catch(error => {
				this.props.sendError(error.response.data);
			});
		}
	}

	handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

		let alphabets = {
			name: 'name',
		}
		let alphabets_only_keys = Object.keys(alphabets);

        for(let key in alphabets_only_keys) {
        	if(typeof fields[alphabets_only_keys[key]] !== "undefined" && fields[alphabets_only_keys[key]] !== ''){
			   if(!fields[alphabets_only_keys[key]].match(/^([a-z]+\s)*[a-z]+$/i)){
				  formIsValid = false;
				  errors[alphabets_only_keys[key]] = ["Only alphabets are allowed."];
			   }
			}
		}

       this.setState({errorsf: errors}, function(){
       	this.props.sendError(this.state.errorsf)
	   }.bind(this));
       return formIsValid;
   }

	clearForm = (id) => { 
			document.getElementById(id).reset();
			this.setState({selectedFile: null, previewFile: null});
		}
	render() {
		const { validated, city, states, state } = this.state;
		return (
			<Form
				noValidate
				id = "city_form"
				onSubmit={e => this.handleSubmit(e)}
			>
				<Form.Row>
					<Form.Group as={Col} md="6">
						<Form.Label>Name *</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder=""
							model="cities"
							name="name"
							onChange={e => this.handleChange(e)}
						/>
					</Form.Group>
					<Form.Group as={Col} md="6">
					<Form.Label>State *</Form.Label>
						<Select
							required
							value={state}
							model="states"
							name="state"
							isClearable = {true}
                  			escapeClearsValue = {true}
							onChange={e => this.selectState(e, 'state')}
							options={states}
						/>
					</Form.Group>
				</Form.Row>
				<Form.Row>
					<Form.Group as={Col} md="12">
						<FormControl component="fieldset" className="col-md-12">
							<RadioGroup
								aria-label="status"
								name="is_active"
								className="col-md-12"
								value={city.is_active === 1 ? '1' : '0'}
								onChange={e => this.handleChange(e)}
							>
								<FormControlLabel className="col-md-2" value="1" control={<Radio />} label="Publish" />
								<FormControlLabel className="col-md-2" value="0" control={<Radio />} label="Inactive" />
							</RadioGroup>
						</FormControl>
					</Form.Group>
				</Form.Row>
				<Button type="submit" onClick={(e) => this.setState({action:'save'})} className="btn btn-primary">
					<i className="la la-save" />
					Save & Close
				</Button>
				&nbsp;&nbsp;

				<Button type="submit" onClick={(e) => this.setState({action:'save_new'})} className="btn btn-success">
					<i className="la la-save" />
					Save & New
				</Button>
				&nbsp;&nbsp;

				<Link to={"/admin/cities"} className="btn btn-danger">
					<i className="la la-remove" />
					Cancel
				</Link>
			</Form>
		);
	}
}

class CreatePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {errors:{}, showError:false};
		this.sendError = this.sendError.bind(this);
	}

	sendError(error) {
		if(Object.keys(error).length)
			this.setState({showError:true});

		this.setState({errors:error});
	}

	render() {
		return (
			<>
				<Notice icon="flaticon-warning kt-font-primary" style={{display: this.state.showError ? 'flex' : 'none' }}>
				{ 
					Object.keys(this.state.errors).map((key, index) => {
						return this.state.errors[key].map((error, i) => {
							console.log(error);
							return <li key={index+i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
						});
					})
				}
				</Notice>

				<div className="row">
					<div className="col-md-12">
						<CustomHead
							beforeCodeTitle={"City"}
							jsCode =   {<div className="kt-portlet__head-toolbar">
							<div className="kt-portlet__head-wrapper">
								<div className="kt-portlet__head-actions">
									<div className="dropdown dropdown-inline">
									<Link to={"/admin/cities"} className="btn btn-clean btn-icon-sm">
												<i className="la la-long-arrow-left"></i>
												Back
											</Link>
									</div>
								</div>
							</div>
						</div>
						}>
							<div className="kt-section">
								<Create data={this.props} sendError={this.sendError} />
							</div>
						</CustomHead>
					</div>
				</div>
			</>
		);
	}
}

export default withRouter(CreatePage);