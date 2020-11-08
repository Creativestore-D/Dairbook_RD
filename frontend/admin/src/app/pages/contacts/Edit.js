import React from "react";
import Notice from "../../partials/content/Notice";
import CustomHead from "../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Checkbox,
    FormControlLabel, FormGroup,
    FormControl, Button as ButtonCore,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, patch, RELIGIONS, GENDERS, CONTACT_METHODS, TITLES, MEDIA_URL, UNIT_MEASURES, post} from "../../crud/api";
import Select from 'react-select';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import moment from "moment";

const defaultMaterialTheme = createMuiTheme({
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

        const {contact_id, type} = this.props.data.match.params
        this.state = {
            validated: false,
            contact: {},
            job_titles: [],
            departments: [],
            companies: [],
            countries: [],
            states: [],
            cities: [],
            selected_gender: {value: ''},
            selected_job_title: {value: ''},
            selected_department: {value: ''},
            selected_company: {value: ''},
            selected_country: {value: ''},
            selected_state: {value: ''},
            selected_city: {value: ''},
            selected_religion: {value: ''},
            selected_preferred_contact_method: {value: ''},
            selected_title: {value: ''},
            type: type,
            selectedFile: null,
            previewFile: null,
        };

        this.getContact(contact_id);
    }

    getContact(contact_id) {
        list('contacts/' + contact_id + '/').then(
            (response) => {
                delete response.data.type;
                let birthday = response.data.birthday;
                this.setState({contact: response.data, birthday: birthday})
                // this.getDropdownsListing();
                this.loadModels();
                this.setSelectfile();

                if (response.data.country && response.data.country.id != undefined && response.data.country.id != "") {
                    this.setDynamicDropdowns(response.data.country.id, 'country');
                }
                if (response.data.state && response.data.state.id != undefined && response.data.state.id != "") {
                    this.setDynamicDropdowns(response.data.state.id, 'state');
                }
                this.setState({previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null})
            });
    }

    loadModels() {
        let contact_data = this.state.contact;

        // static dropdowns calculation here -

        let static_dropdowns = { // when you have static dropdown like gender just put here
            religion: RELIGIONS,
            gender: GENDERS,
            title: TITLES,
            preferred_contact_method: CONTACT_METHODS,
        }

        let dropdown_keys = Object.keys(static_dropdowns);
        for (let key in dropdown_keys) {
            for (let index in static_dropdowns[dropdown_keys[key]]) {
                if (static_dropdowns[dropdown_keys[key]][index].value === contact_data[dropdown_keys[key]]) {
                    this.setState({['selected_' + dropdown_keys[key]]: static_dropdowns[dropdown_keys[key]][index]});
                    break;
                }
            }
        }

        let models = {
            'AbCompanies': {},
            'AbTitles': {},
            'AbDepartments': {},
            'AbCountries': {},
        }

        // lets do some mapping to avoid if else conditions
        let state_endpoints = {
            AbCompanies: ['company'],
            AbDepartments: ['department'],
            AbCountries: ['country'],
            AbTitles: ['job_title'],
        }

        post('abmodels', {models: models}).then(function (response) {
            let newStates = {};
            for (let opt in response.data) {

                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;

                    Object.keys(state_endpoints).map((key, i) => {
                        state_endpoints[key].map((state, index) => {
                            if (opt === key && contact_data[state] !== null && contact_data[state].id !== undefined && contact_data[state].id === row.id)
                                newStates['selected_' + state] = row;
                        })
                    })

                })
            }
            console.log('newstat', newStates);
            newStates['departments'] = response.data.AbDepartments;
            newStates['countries'] = response.data.AbCountries;
            newStates['job_titles'] = response.data.AbTitles;
            newStates['companies'] = response.data.AbCompanies;

            this.setState(newStates);
        }.bind(this))
    }

    getDropdownsListing() {
        let contact_data = this.state.contact;
        let dropdowns = {// when you have database dropdown like departments just put here
            company: 'companies',
            department: 'departments',
            job_title: 'job_titles',
            country: 'countries',
        }

        let duplicating_dropdowns = {}
        // static dropdowns calculation here -

        let static_dropdowns = { // when you have static dropdown like gender just put here
            religion: RELIGIONS,
            gender: GENDERS,
            title: TITLES,
            preferred_contact_method: CONTACT_METHODS,
        }

        let dropdown_keys = Object.keys(static_dropdowns);
        for (let key in dropdown_keys) {
            for (let index in static_dropdowns[dropdown_keys[key]]) {
                if (static_dropdowns[dropdown_keys[key]][index].value === contact_data[dropdown_keys[key]]) {
                    this.setState({['selected_' + dropdown_keys[key]]: static_dropdowns[dropdown_keys[key]][index]});
                    break;
                }
            }
        }

        dropdown_keys = Object.keys(dropdowns);
        for (let key in dropdown_keys) {
            let params = {is_active: 1, records: 'all'}
            if (dropdowns[dropdown_keys[key]] === 'companies')
                params = {...params, ...{'available': true, contact_id: this.state.contact.id}}

            list(dropdowns[dropdown_keys[key]], params).then(function (response) {
                let data = response.data;
                let selected = {};
                for (let opt in data) {
                    // special case for contacts
                    if (dropdowns[dropdown_keys[key]] === 'contacts')
                        data[opt].name = data[opt].first_name + ' ' + data[opt].last_name;
                    else if (dropdowns[dropdown_keys[key]] === 'users')
                        data[opt].name = data[opt].contact.first_name + ' ' + data[opt].contact.last_name;

                    data[opt].label = data[opt].name;
                    data[opt].value = data[opt].id;

                    if (contact_data[dropdown_keys[key]] != undefined && data[opt].id === contact_data[dropdown_keys[key]].id)
                        selected = data[opt]

                    if (duplicating_dropdowns[dropdowns[dropdown_keys[key]]] != undefined) {
                        for (let index in duplicating_dropdowns[dropdowns[dropdown_keys[key]]]) {
                            let duplicated_el = duplicating_dropdowns[dropdowns[dropdown_keys[key]]][index];

                            if (contact_data[duplicated_el] != undefined && data[opt].id === contact_data[duplicated_el].id) {
                                this.setState({['selected_' + duplicated_el]: data[opt]});
                            }
                        }
                    }
                }
                this.setState({
                    [dropdowns[dropdown_keys[key]]]: data,
                    ['selected_' + dropdown_keys[key]]: selected,
                    engine: contact_data
                });

            }.bind(this));
        }
    }

    handleChange(event, type) {
        var contact = this.state.contact;
        if (type !== 'birthday') {
            var attr = event.target.name;
            var val = event.target.value;
        } else {
            var attr = type;
            var val = moment(event).format("YYYY-MM-DD");
            this.setState({birthday: event})
        }
        if (attr === 'is_active')
            val = parseInt(val);
        contact[attr] = val;
        this.setState({contact: contact})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        this.checkDataFormat(); // this is done to convert foregin table objects into pk
        patch('contacts/' + this.state.contact.id + '/', this.state.contact).then(
            (response) => {
                delete response.data.type;
                this.setState({contact: response.data});
                this.props.data.history.push("/admin/contacts");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    checkDataFormat() {
        let contact = this.state.contact;
        let related_data = ['department', 'company', 'country', 'state', 'city', 'job_title', 'religion', 'gender', 'title', 'preferred_contact_method'];
        related_data.map((val, i) => {
            contact[val] = this.state['selected_' + val].value;
        })
        this.setState({contact: contact});
    }

    setSelectfile() {
        if (this.state.contact.media) {
            let file = {};
            let filename_pieces = this.state.contact.media.original_file_name.split('/');
            file.name_c = filename_pieces[filename_pieces.length - 1];
            this.setState({selectedFile: file});
        }
    }

    fileChangedHandler = (event) => {
        let file = event.target.files[0];
        this.setState({
            previewFile: URL.createObjectURL(file)
        });
        if (file != undefined) {
            file.name_c = file.name;
            let contact = this.state.contact;
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                contact.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    contact.file = reader.result;
                    this.setState({selectedFile: file, contact: contact});
                };
            }
        }
    }

    handleFileRemove = (event) => {
        let contact = this.state.contact;
        delete contact.file
        this.setState({selectedFile: null, contact: contact, previewFile: null})
        document.getElementById('contact-image-upload').value = '';
    }

    selectChange(value, key) {
        let contact = this.state.contact;
        contact[key] = value && value.value ? value.value : '';
        this.setState({['selected_' + key]: value ? value : '', contact: contact});
        this.setDynamicDropdowns(value && value.id ? value.id : '', key);

    }

    setDynamicDropdowns(id, key) {
        if (['country', 'state'].indexOf(key) > -1 && id) {
            let endpoint = '', params = {}, key_to_update = '', models = {}, list_to_update = '';
            if (key === 'country') {
                models = {
                    AbStates: {country_id: id}
                }
                key_to_update = 'state';
                list_to_update = 'states';
            } else {
                models = {
                    AbCities: {state_id: id}
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

                        if (this.state.contact[key_to_update] != undefined && row.id === this.state.contact[key_to_update].id)
                            selected = row;
                    })
                    this.setState({
                        [list_to_update]: response.data[opt], ['selected_' + key_to_update]: selected
                    })
                }

            }.bind(this));
        }
    }

    render() {
        const {
            birthday, contact, job_titles, departments, selected_job_title, selected_religion,
            selected_department, selected_company, companies, selected_country, selected_gender,
            selected_state, selected_city, countries, selected_title, cities, states,
            selected_preferred_contact_method, selectedFile
        } = this.state;
        return (
            <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <div className="col-12">
                        <h5>Personal Information</h5>
                        <hr/>
                    </div>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Title *</Form.Label>
                        <Select
                            value={selected_title}
                            model="contact"
                            name="title"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'title')}
                            options={TITLES}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="first_name"
                            name="first_name"
                            defaultValue={contact ? contact.first_name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="contact"
                            name="last_name"
                            defaultValue={contact ? contact.last_name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Birthday</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    minDate={new Date('1990-01-01')}
                                    disableFuture={true}
                                    value={birthday}
                                    format="dd/MM/yyyy"
                                    onChange={e => this.handleChange(e, 'birthday')}
                                    animateYearScrolling
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Gender *</Form.Label>
                        <Select
                            value={selected_gender}
                            model="contact"
                            name="gender"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'gender')}
                            options={GENDERS}
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <div className="col-12">
                        <h5>Company Info</h5>
                        <hr/>
                    </div>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Job Title *</Form.Label>
                        <Select
                            value={selected_job_title}
                            model="job_title"
                            name="name"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'job_title')}
                            options={job_titles}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Department</Form.Label>
                        <Select
                            value={selected_department}
                            model="department"
                            name="name"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'department')}
                            options={departments}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Company Name *</Form.Label>
                        <Select
                            value={selected_company}
                            model="company"
                            name="name"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'company')}
                            options={companies}
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <div className="col-12">
                        <h5>Address Information</h5>
                        <hr/>
                    </div>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} md="3" xs="12">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="contact"
                            name="address"
                            defaultValue={contact.address ? contact.address : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="3" xs="12">
                        <Form.Label>Country *</Form.Label>
                        <Select
                            value={selected_country}
                            model="country"
                            name="name"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'country')}
                            options={countries}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="3" xs="12">
                        <Form.Label>State *</Form.Label>
                        <Select
                            value={selected_state}
                            model="state"
                            name="name"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'state')}
                            options={states}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="3" xs="12">
                        <Form.Label>City *</Form.Label>
                        <Select
                            value={selected_city}
                            model="city"
                            name="name"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'city')}
                            options={cities}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Business Phone</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="contact"
                            name="business_phone"
                            defaultValue={contact.business_phone ? contact.business_phone : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Mobile Phone</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="contact"
                            name="mobile_phone"
                            defaultValue={contact.mobile_phone ? contact.mobile_phone : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Preferred contact method</Form.Label>
                        <Select
                            value={selected_preferred_contact_method}
                            model="contact"
                            name="preferred_contact_method"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'preferred_contact_method')}
                            options={CONTACT_METHODS}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Skpye</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="contact"
                            name="skype"
                            defaultValue={contact.skype ? contact.skype : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Linkedin</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="contact"
                            name="linkedin"
                            defaultValue={contact.linkedin ? contact.linkedin : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4" xs="12">
                        <Form.Label>Religion</Form.Label>
                        <Select
                            value={selected_religion}
                            model="contacts"
                            name="religion"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'religion')}
                            options={RELIGIONS}
                        />
                    </Form.Group>
                </Form.Row>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox name="is_primary" checked={contact.is_primary ? true : false}
                                      onChange={(e) => this.handleChange(e)} value="1"/>
                        }
                        label="Primary"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox name="is_public" checked={contact.is_public ? true : false}
                                      onChange={(e) => this.handleChange(e)} value="1"/>
                        }
                        label="Public"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox name="is_published" checked={contact.is_published ? true : false}
                                      onChange={(e) => this.handleChange(e)} value="1"/>
                        }
                        label="Published"
                    />
                </FormGroup>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <input
                            accept="image/*"
                            style={{display: 'none'}}
                            type="file"
                            id="contact-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="contact-image-upload">
                            <ButtonCore variant="outlined" color="inherit" component="span">
                                Select Image
                                <CloudUploadIcon style={{marginLeft: '5px'}}/>
                            </ButtonCore>
                        </label>
                        <div className="form-group form-group-last row">
                            <div className="col-12 col-md-4">
                                <div className="dropzone dropzone-multi" id="kt_dropzone_5">
                                    <div className="dropzone-items" style={{display: selectedFile ? 'block' : 'none'}}>
                                        <div className="dropzone-item">
                                            <div className="dropzone-file">
                                                {this.state.previewFile &&
                                                <div style={{'max-width': '250px'}}><img style={{width: "100%"}}
                                                                                         src={this.state.previewFile}/>
                                                </div>
                                                }
                                                <div className="dropzone-filename" title="some_image_file_name.jpg">
                                                    <span
                                                        data-dz-name>{selectedFile ? selectedFile.name_c : 'No file selected'}</span>
                                                    <strong>{selectedFile && selectedFile.size_c ? '(' + selectedFile.size_c + ')' : ''}</strong>
                                                </div>
                                                <div className="dropzone-error"
                                                     data-dz-errormessage>{selectedFile && selectedFile.error ? selectedFile.error : ''}</div>
                                            </div>
                                            <div className="dropzone-toolbar">
                                                <span onClick={(e) => this.handleFileRemove(e)}
                                                      className="dropzone-delete" data-dz-remove><i
                                                    className="flaticon2-cross"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="form-text text-muted">Max file size is 2MB.</span>
                            </div>
                        </div>
                    </Form.Group>
                </Form.Row>
                <Button type="submit" className="btn btn-primary">
                    <i className="la la-save"/>
                    Update
                </Button>
                &nbsp;&nbsp;

                <Link to={"/admin/contacts"} className="btn btn-danger">
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
        this.state = {errors: {}, showError: false, type: props.match.params.type};
        this.sendError = this.sendError.bind(this);
    }

    sendError(error) {
        if (Object.keys(error).length)
            this.setState({showError: true});

        this.setState({errors: error});
    }

    render() {

        // const { Formik } = formik;
        const buttons = <Link to={"/admin/contacts"} className="btn btn-clean btn-icon-sm">
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
                            beforeCodeTitle={'Contact'}
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