import React from "react";
import Notice from "../../partials/content/Notice";
import CustomHead from "../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, patch, post, TIMEZONES} from "../../crud/api";
import Select from 'react-select';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import moment from "moment";
import blue from "@material-ui/core/colors/blue";

const defaultMaterialTheme = createMuiTheme({
    palette: {
        primary: blue,
    },
    props: {
        MuiInput: {
            disableUnderline: true,
        },
        MuiTextField: {
            style: {
                display: "block",
            },
        },
        MuiInputBase: {
            style: {
                display: "block",
            },
            disableUnderline: true,
            inputProps: {
                style: {
                    display: "block",
                    height: "calc(1.5em + 1.3rem + 2px)",
                    padding: "0.65rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                    color: "#495057",
                    backgroundColor: "#fff",
                    backgroundClip: "padding-box",
                    border: "1px solid #e2e5ec",
                    borderRadius: "4px",
                    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    boxSizing: "border-box",
                }
            }
        },
    },
});

class Edit extends React.Component {
    constructor(props) {
        super(props);
        const {airport_id} = this.props.data.match.params;
        this.state = {
            airport: {id: airport_id},
            country: {label: 'Select Country', value: null},
            state: {label: 'Select State', value: null},
            city: {label: 'Select City', value: null},
            timezone: {label: 'Select Timezone', value: null},
            airfield: {label: 'Select Airfield Type', value: null},
            countries: [],
            states: [],
            cities: [],
            timezones: TIMEZONES,
            sunrise: new Date(),
            sunset: new Date(),
            airfieldtypes: [],
            validated: false,
            action: '',
        };
        this.getAirport(airport_id);
        //this.getAirfieldTypes();
        //this.getCountries();
    }

    getAirport(airport_id) {
        list('airport/' + airport_id + '/').then(
            (response) => {
                delete response.data.user;
                this.setState({
                    sunset: response.data.sunset ? moment(response.data.sunset, 'HH:mm') : new Date(),
                    sunrise: response.data.sunrise ? moment(response.data.sunrise, 'HH:mm') : new Date(),
                    airport: response.data
                });

                let timezone = this.state.timezone;
                this.state.timezones.map((index) => {
                    if (index.value === response.data.time_zone) {
                        timezone = {value: index.value, label: index.label};
                    }
                })
                let airfield_type = {id: response.data.airfield_type.id, label: response.data.airfield_type.name};
                response.data.airfield_type = response.data.airfield_type.id;
                /*let country = {id: response.data.country.id, label: response.data.country.name};
                response.data.country = response.data.country.id;
                let state = {id: response.data.state.id, label: response.data.state.name};
                response.data.state = response.data.state.id;
                let city = {id: response.data.city.id, label: response.data.city.name};
                response.data.city = response.data.city.id;*/
                // response.data.user = response.data.user ? response.data.user.id : null;
                this.setState({
                    timezone: timezone,
                    airfield_type: airfield_type,
                });
                //this.getStates(response.data.country);
                //this.getCities(response.data.state);
                this.loadModels();
            });
    }

    loadModels() {
        let airport_data = this.state.airport;
        let models = {
            'AbAirfieldTypes': {},
            'AbCountries': {},
            'AbStates': {country_id: airport_data.country && airport_data.country.id ? airport_data.country.id : null},
            'AbCities': {state_id: airport_data.state && airport_data.state.id ? airport_data.state.id : null},
        }

        let state_endpoints = {
            AbAirfieldTypes: ['airfield_type'],
            AbCountries: ['country'],
            AbStates: ['state'],
            AbCities: ['city'],
        }

        post('abmodels', {models: models}).then(function (response) {
            let newStates = {};
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;

                    Object.keys(state_endpoints).map((key, i) => {
                        state_endpoints[key].map((state, index) => {
                            if (opt === key && airport_data[state] !== null && airport_data[state].id !== undefined && airport_data[state].id === row.id)
                                newStates[state] = row;
                        })
                    })
                })
            }
            newStates['countries'] = response.data.AbCountries;
            newStates['states'] = response.data.AbStates;
            newStates['cities'] = response.data.AbCities;
            newStates['airfieldtypes'] = response.data.AbAirfieldTypes;
            this.setState(newStates);
        }.bind(this))
    }

    selectChange(value, key) {
        let airport = this.state.airport;
        airport[key] = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', airport: airport});
        if (['country', 'state'].indexOf(key) > -1 && value) {
            let endpoint = '', params = {}, key_to_update = '', list_to_update = '';
            let models = {};
            if (key === 'country') {
                models = {
                    AbStates: {country_id: value.id}
                }
                key_to_update = 'state';
                list_to_update = 'states';
            } else if (key === 'state') {
                models = {
                    AbCities: {state_id: value.id}
                }
                key_to_update = 'city';
                list_to_update = 'cities';
            }

            post('abmodels', {models: models}).then(function (response) {
                let selected = {};
                for (let opt in response.data) {
                    response.data[opt].map((row, i) => {
                        response.data[opt][i].label = row.name;
                        response.data[opt][i].value = row.id;

                        if (this.state.airport[list_to_update] != undefined && row.id === this.state.airport[list_to_update].id)
                            selected = row;
                    })

                    this.setState({
                        [list_to_update]: response.data[opt], [key_to_update]: selected
                    })
                }
            }.bind(this));
        }
    }


    selectAirfieldType(value, key) {
        let airport = this.state.airport;
        airport.airfield_type = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', airport: airport});
    }

    selectTimeZone(value, key) {
        let airport = this.state.airport;
        airport.time_zone = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', airport: airport});
    }

    handleChange(event, type) {
        var airport = this.state.airport;
        if (type !== 'sunrise' && type !== 'sunset') {
            var attr = event.target.name;
            var val = event.target.value;
        } else {
            var attr = type;
            var val = moment(event).format("HH:mm");
            if (type === 'sunrise')
                this.setState({sunrise: event})
            else
                this.setState({sunset: event})
        }

        if (attr === 'is_active')
            val = parseInt(val);

        airport[attr] = val;
        this.setState({airport: airport})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        this.checkDataFormat(); // this is done to convert foregin table objects into pk
        patch('airport/' + this.state.airport.id + '/', this.state.airport).then(
            (response) => {
                this.setState({airport: response.data});
                this.props.data.history.push("/admin/airport");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    checkDataFormat() {
        let airport = this.state.airport;
        let related_data = ['country', 'state', 'city'];
        related_data.map((val, i) => {
            airport[val] = this.state[val].value;
        })
        this.setState({airport: airport});
    }


    render() {
        const {airport, country, countries, state, states, city, cities, airfield_type, airfieldtypes, timezones, timezone, sunrise, sunset} = this.state;
        return (
            <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="airports"
                            name="name"
                            defaultValue={airport ? airport.name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Airfield Type *</Form.Label>
                        <Select
                            required
                            value={airfield_type}
                            model="airfieldtypes"
                            name="airfield_type"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectAirfieldType(e, 'airfield_type')}
                            options={airfieldtypes}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Country *</Form.Label>
                        <Select
                            required
                            value={country}
                            model="countries"
                            name="country"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectChange(e, 'country')}
                            options={countries}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>State</Form.Label>
                        <Select
                            value={state}
                            model="states"
                            name="state"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectChange(e, 'state')}
                            options={states}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>City</Form.Label>
                        <Select
                            value={city}
                            model="cities"
                            name="states"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectChange(e, 'city')}
                            options={cities}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Timezone</Form.Label>
                        <Select
                            value={timezone}
                            name="time_zone"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectTimeZone(e, 'timezone')}
                            options={timezones}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>IATA Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="airports"
                            name="iata_code"
                            value={airport ? airport.iata_code : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>ICAO Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="airports"
                            name="icao_code"
                            value={airport ? airport.icao_code : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder=""
                            model="airports"
                            name="latitude"
                            value={airport ? airport.latitude : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder=""
                            model="airports"
                            name="longitude"
                            value={airport ? airport.longitude : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Sunrise</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    clearable
                                    ampm={false}
                                    value={sunrise}
                                    onChange={e => this.handleChange(e, 'sunrise')}
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Sunset</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    clearable
                                    ampm={false}
                                    value={sunset}
                                    onChange={e => this.handleChange(e, 'sunset')}
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <FormControl component="fieldset" className="col-md-12">
                            <RadioGroup
                                aria-label="status"
                                name="is_active"
                                className="col-md-12"
                                value={airport.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/airport"} className="btn btn-danger">
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
        const buttons = <Link to={"/admin/airport"} className="btn btn-clean btn-icon-sm">
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
                            beforeCodeTitle={'Airport'}
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