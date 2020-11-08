import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl, Button as ButtonCore,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, patch, post} from "../../../crud/api";
import Select from 'react-select';


class Edit extends React.Component {
    constructor(props) {
        super(props);

        const {state_id} = this.props.data.match.params
        this.state = {
            validated: false,
            state: {id: state_id},
            countries: [],
            country: {},
            fields: {},
            errorsf: {}
        };

        this.getState(state_id);

    }

    getState(state_id) {
        list('states/' + state_id + '/').then(
            (response) => {
                delete response.data.state;
                /*let country = this.state.country;
                this.state.countries.map((index) => {
                    if (index.id === response.data.country_id) {
                        country = {id: index.id, label: index.name};
                        response.data.country = index.id;
                    }
                })*/
                this.setState({state: response.data});
                this.loadModels();
            });
    }

    loadModels() {
        let state_data = this.state.state;
        let models = {
            'AbCountries': {},
        }

        let state_endpoints = {
            AbCountries: ['country'],
        }

        post('abmodels', {models: models}).then(function (response) {
            let newStates = {};
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;

                    Object.keys(state_endpoints).map((key, i) => {
                        state_endpoints[key].map((state, index) => {
                            if (opt === key && state_data[state] !== null && state_data[state].id !== undefined && state_data[state].id === row.id)
                                newStates[state] = row;
                        })
                    })
                })
            }
            newStates['countries'] = response.data.AbCountries;
            this.setState(newStates);
        }.bind(this))
    }

    //get all Countries List
    getCountries() {
        let filter = {'is_active': 1, records: 'all'};
        list('countries', filter).then(function (response) {
            let data = response.data;
            for (let opt in data) {
                data[opt].label = data[opt].name;
                data[opt].value = data[opt].id;
            }
            this.setState({countries: data});
            this.getState(this.state.state.id);
        }.bind(this));

    }

    selectCountry(value, key) {
        let state = this.state.state;
        state.country = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', state: state});
    }

    handleChange(event) {
        var state = this.state.state;
        var attr = event.target.name;
        var val = event.target.value;
        if (attr === 'is_active')
            val = parseInt(val);

        state[attr] = val;
        this.setState({state: state})

        let fields = this.state.fields;
        fields[attr] = val;
        this.setState({fields});
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (this.handleValidation()) {
            this.setState({validated: true});
            patch('states/' + this.state.state.id + '/', this.state.state).then(
                (response) => {
                    this.setState({state: response.data});
                    this.props.data.history.push("/admin/states");
                }).catch(error => {
                this.props.sendError(error.response.data);
            });
        }
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        let alphabets = {
            name: 'name',
        }
        let alphabets_only_keys = Object.keys(alphabets);

        for (let key in alphabets_only_keys) {
            if (typeof fields[alphabets_only_keys[key]] !== "undefined" && fields[alphabets_only_keys[key]] !== '') {
                if (!fields[alphabets_only_keys[key]].match(/^([a-z]+\s)*[a-z]+$/i)) {
                    formIsValid = false;
                    errors[alphabets_only_keys[key]] = ["Only alphabets are allowed."];
                }
            }
        }

        this.setState({errorsf: errors}, function () {
            this.props.sendError(this.state.errorsf)
        }.bind(this));
        return formIsValid;
    }

    render() {
        const {validated, state, countries, country} = this.state;
        return (
            <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <Form.Group as={Col} md="6">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="states"
                            name="name"
                            defaultValue={state ? state.name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                        <Form.Label>Country *</Form.Label>
                        <Select
                            value={country}
                            model="countries"
                            name="country"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectCountry(e, 'country')}
                            options={countries}
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
                                value={state.is_active === 1 ? '1' : '0'}
                                onChange={e => this.handleChange(e)}
                            >
                                <FormControlLabel className="col-md-2" value="1" control={<Radio/>} label="Publish"/>
                                <FormControlLabel className="col-md-2" value="0" control={<Radio/>} label="Inactive"/>
                            </RadioGroup>
                        </FormControl>
                    </Form.Group>
                </Form.Row>
                <Button type="submit" className="btn btn-primary">
                    <i className="la la-save"/>
                    Update
                </Button>
                &nbsp;&nbsp;

                <Link to={"/admin/states"} className="btn btn-danger">
                    <i className="la la-remove"/>
                    Cancel
                </Link>
            </Form>
        );
    }
}

class EditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors: {}, showError: false};
        this.sendError = this.sendError.bind(this);
    }

    sendError(error) {
        if (Object.keys(error).length)
            this.setState({showError: true});

        this.setState({errors: error});
    }

    render() {

        // const { Formik } = formik;
        const buttons = <Link to={"/admin/states"} className="btn btn-clean btn-icon-sm">
            <i className="la la-long-arrow-left"></i>
            Back
        </Link>
        return (
            <>
                <Notice icon="flaticon-warning kt-font-primary"
                        style={{display: this.state.showError ? 'flex' : 'none'}}>
                    {
                        Object.keys(this.state.errors).map((key, index) => {
                            return this.state.errors[key].map((error, i) => {
                                console.log(error);
                                return <li key={index + i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
                            });
                        })
                    }
                </Notice>

                <div className="row">
                    <div className="col-md-12">
                        <CustomHead
                            beforeCodeTitle={'State'}
                            jsCode={<div className="kt-portlet__head-toolbar">
                                <div className="kt-portlet__head-wrapper">
                                    <div className="kt-portlet__head-actions">
                                        <div className="dropdown dropdown-inline">
                                            {buttons}
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        >
                            <div className="kt-section">
                                <Edit data={this.props} sendError={this.sendError}/>
                            </div>
                        </CustomHead>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(EditPage);