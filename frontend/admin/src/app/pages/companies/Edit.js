import React from "react";
import Notice from "../../partials/content/Notice";
import CustomHead from "../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl, Button as ButtonCore,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, patch, MEDIA_URL, post} from "../../crud/api";
import Select from 'react-select';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";


class Edit extends React.Component {
    constructor(props) {
        super(props);

        const {company_id} = this.props.data.match.params
        this.state = {
            validated: false,
            company: {id: company_id},
            specialities: [],
            selected_specialities: [],
            countries: [],
            country: {},
            states: [],
            state: {},
            cities: [],
            city: {},
            selectedFile: null,
            previewFile: null,
        };

        this.getCompany(company_id);
        //this.getSpecialities();
        //this.getCountries();

    }

    getCompany(company_id) {
        list('companies/' + company_id + '/').then(
            (response) => {
                delete response.data.company;
                let selected_specialities = [];
                let specialities_ids = [];
                for (let i in response.data.specialities) {
                    selected_specialities.push({
                        id: response.data.specialities[i].id,
                        label: response.data.specialities[i].name
                    });

                    specialities_ids.push(selected_specialities[i].id);
                }
                response.data.specialities = specialities_ids;
                let website = response.data.website;
                if(website.indexOf('http:') === -1 && website.indexOf('https:') === -1){
                    website = 'http://' + website;
                    response.data.website = website;
                }
                /*country = {id: response.data.country.id, label: response.data.country.name};
                response.data.country = response.data.country.id;
                state = {id: response.data.state.id, label: response.data.state.name};
                response.data.state = response.data.state.id;
                city = {id: response.data.city.id, label: response.data.city.name};
                response.data.city = response.data.city.id;
                this.setState({
                    company: response.data,
                    country: country,
                    state: state,
                    city: city,
                    selected_specialities: selected_specialities,
                    previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null
                });*/
                this.setState({company: response.data, selected_specialities: selected_specialities});
                this.setSelectfile();
                this.loadModels();
                //this.getStates(response.data.country);
               // this.getCities(response.data.state);
            });
    }

    loadModels() {
        let company_data = this.state.company;

        let models = {
            'AbSpecialities': {},
            'AbCountries': {},
            'AbStates': {country_id : company_data.country.id ? company_data.country.id : 0},
            'AbCities': {state_id : company_data.state.id ? company_data.state.id : 0},
        }

        let state_endpoints = {
          AbCountries:['country'],
          AbStates:['state'],
          AbCities:['city']
        }

        post('abmodels', {models: models}).then(function (response) {
            let newStates = {};
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;
                    Object.keys(state_endpoints).map((key, i) => {
                      state_endpoints[key].map((state, index) => {
                        if(opt === key && company_data[state] !== null && company_data[state].id !== undefined && company_data[state].id === row.id)
                          newStates[state] = row;
                      })
                    })
                })
            }
            newStates['countries'] = response.data.AbCountries;
            newStates['states'] = response.data.AbStates;
            newStates['cities'] = response.data.AbCities;
            newStates['specialities'] = response.data.AbSpecialities;
            this.setState(newStates);
        }.bind(this))
    }

    selectChange(value, key) {
        let company = this.state.company;
        company[key] = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', company: company});
        if (['country', 'state', 'city'].indexOf(key) > -1 && value) {
            let key_to_update = '', list_to_update = '';
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

                        if (this.state.company[list_to_update] != undefined && row.id === this.state.company[list_to_update].id)
                            selected = row;
                    })

                    this.setState({
                        [list_to_update]: response.data[opt], [key_to_update]: selected
                    })
                }
            }.bind(this));
        }
    }

    selectSpeciality(value, key) {
        let company = this.state.company;
        company.specialities = [];
        for (let i in value) {
            company.specialities.push(value[i].id);
        }
        this.setState({[key]: value, company: company});
    }

    handleChange(event) {
        var company = this.state.company;
        var attr = event.target.name;
        var val = event.target.value;
        if (attr === 'is_active')
            val = parseInt(val);

        company[attr] = val;
        this.setState({company: company})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        this.checkDataFormat(); // this is done to convert foregin table objects into pk
        patch('companies/' + this.state.company.id + '/', this.state.company).then(
            (response) => {
                this.setState({company: response.data});
                this.props.data.history.push("/admin/companies");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    checkDataFormat() {
      let company = this.state.company;
      let related_data = ['country','state','city'];
      related_data.map((val, i) => {
        company[val] = this.state[val].value;
      })
      this.setState({company:company});
    }

    setSelectfile() {
        if (this.state.company.media) {
            let file = {};
            let filename_pieces = this.state.company.media.original_file_name.split('/');
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
            let company = this.state.company;
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                company.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    company.file = reader.result;
                    this.setState({selectedFile: file, company: company});
                };
            }
        }
    }

    handleFileRemove = (event) => {
        let company = this.state.company;
        delete company.file
        this.setState({selectedFile: null, company: company, previewFile: null})
        document.getElementById('company-image-upload').value = '';
    }

    render() {
        const {company, specialities, selected_specialities, countries, country, states, state, city, cities, selectedFile} = this.state;
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
                            model="companies"
                            name="name"
                            value={company ? company.name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="8">
                        <Form.Label>Speciality *</Form.Label>
                        <Select
                            required
                            value={selected_specialities ? selected_specialities : ''}
                            model="specialities"
                            name="speciality"
                            onChange={e => this.selectSpeciality(e, 'selected_specialities')}
                            options={specialities}
                            isMulti
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="6">
                        <Form.Label>Business Number</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder=""
                            model="companies"
                            name="business_phone"
                            value={company ? company.business_phone : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="companies"
                            name="website"
                            value={company ? company.website : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="companies"
                            name="address"
                            value={company ? company.address : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Country</Form.Label>
                        <Select
                            value={country ? country : ''}
                            model="countries"
                            name="country"
                            isClearable = {true}
                            escapeClearsValue = {true}
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
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'state')}
                            options={states}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>City</Form.Label>
                        <Select
                            value={city}
                            model="cities"
                            name="city"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectChange(e, 'city')}
                            options={cities}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>P.O.Box</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="companies"
                            name="po_box"
                            value={company ? company.po_box : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Zipcode/Postal Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="companies"
                            name="zip_code"
                            value={company ? company.zip_code : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>RFQ Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="companies"
                            name="rfq_email"
                            value={company ? company.rfq_email : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>AOG Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="companies"
                            name="aog_email"
                            value={company ? company.aog_email : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Profile</Form.Label>
                        <Form.Control as="textarea" rows="5"
                                      model="companies"
                                      name="profile"
                                      value={company ? company.profile : ''}
                                      onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <input
                            accept="image/*"
                            style={{display: 'none'}}
                            type="file"
                            id="company-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="company-image-upload">
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
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <FormControl component="fieldset" className="col-md-12">
                            <RadioGroup
                                aria-label="status"
                                name="is_active"
                                className="col-md-12"
                                value={company.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/companies"} className="btn btn-danger">
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
        const buttons = <Link to={"/admin/companies"} className="btn btn-clean btn-icon-sm">
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
                            beforeCodeTitle={'Company'}
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