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
import {list, post, TIMEZONES} from "../../crud/api";
import Select from 'react-select';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import moment from "moment";
import blue from "@material-ui/core/colors/blue";
import Alert from 'react-bootstrap/Alert';

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

class Create extends React.Component {

    constructor(props) {
        const user_id = props.data.userProp.id;
        super(props);
        this.state = {
            airport: {is_active: 0, is_published: 0, user: user_id, sunrise: moment(new Date).format("HH:mm"), sunset: moment(new Date).format("HH:mm")},
            selected_country: {label: 'Select Country', value: 0},
            selected_state: {label: 'Select State', value: 0},
            selected_city: {label: 'Select City', value: 0},
            timezone: {label: 'Select Timezone', value: 0},
            selected_airfield: {label: 'Select Airfield Type', value: 0},
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

        //this.getCountries();
        //this.getAirfieldTypes();
        this.loadModels();
    }

    loadModels() {
        let models = {
            'AbAirfieldTypes': {},
            'AbCountries': {},
        }
        post('abmodels', {models: models}).then(function (response) {
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;
                })
            }
            this.setState({
                airfieldtypes: response.data.AbAirfieldTypes,
                countries: response.data.AbCountries,
            })
        }.bind(this))
    }

    selectChange(value, key) {
        let airport = this.state.airport;
        airport[key] = value && value.value ? value.value : '';
        this.setState({['selected_' + key]: value ? value : '', airport: airport});
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
                        [list_to_update]: response.data[opt], ['selected_' + key_to_update]: selected
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
        post('airports', this.state.airport).then(
            (response) => {
                response.data.user = response.data.user.id;
                this.setState({airport: response.data, alert_status: 'show'});
                this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm("airports-form") : "/admin/airport");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    clearForm = (id) => {
        document.getElementById(id).reset();
        this.setState({
            selected_country: {label: 'Select Country', value: 0},
            selected_airfield: {label: 'Select Airfield Type', value: 0},
            selected_state: {label: 'Select State', value: 0},
            selected_city: {label: 'Select City', value: 0},
            timezone: {label: 'Select Timezone', value: 0},
            sunrise: new Date(),
            sunset: new Date()
        });
        setTimeout(() => {
            this.setState({alert_status: 'hide'});
        }, 3000);
    }

    render() {
        const {
            airport, selected_country, countries, selected_state, states, selected_city, cities,
            selected_airfield, airfieldtypes, timezones, timezone, sunrise, sunset
        } = this.state;
        return (
            <Form
                noValidate
                id="airports-form"
                onSubmit={e => this.handleSubmit(e)}
            >
                {this.state.alert_status === 'show' ?
                    <Form.Row>
                        <Form.Group as={Col} md="9" xs="12">
                        </Form.Group>
                        <Form.Group as={Col} md="3" xs="12">
                            <Alert variant='success'>
                                Successfully Created
                            </Alert>
                        </Form.Group>
                    </Form.Row>
                    : ''}
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="airports"
                            name="name"
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Airfield Type *</Form.Label>
                        <Select
                            required
                            value={selected_airfield}
                            model="airfieldtypes"
                            name="airfield_type_id"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectAirfieldType(e, 'selected_airfield')}
                            options={airfieldtypes}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Country *</Form.Label>
                        <Select
                            required
                            value={selected_country}
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
                            value={selected_state}
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
                            value={selected_city}
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
                <Button type="submit" onClick={(e) => this.setState({action: 'save'})} className="btn btn-primary">
                    <i className="la la-save"/>
                    Save & Close
                </Button>
                &nbsp;&nbsp;

                <Button type="submit" onClick={(e) => this.setState({action: 'save_new'})} className="btn btn-success">
                    <i className="la la-save"/>
                    Save & New
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

class CreatePage extends React.Component {
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
        return (
            <>
                <Notice icon="flaticon-warning kt-font-primary"
                        style={{display: this.state.showError ? 'flex' : 'none'}}>
                    {
                        Object.keys(this.state.errors).map((key, index) => {
                            return this.state.errors[key].map((error, i) => {
                                return <li key={index + i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
                            });
                        })
                    }
                </Notice>

                <div className="row">
                    <div className="col-md-12">
                        <CustomHead
                            beforeCodeTitle={"Airport"}
                            jsCode={<div className="kt-portlet__head-toolbar">
                                <div className="kt-portlet__head-wrapper">
                                    <div className="kt-portlet__head-actions">
                                        <div className="dropdown dropdown-inline">
                                            <Link to={"/admin/airport"} className="btn btn-clean btn-icon-sm">
                                                <i className="la la-long-arrow-left"></i>
                                                Back
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }>
                            <div className="kt-section">
                                <Create data={this.props} sendError={this.sendError}/>
                            </div>
                        </CustomHead>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(CreatePage);