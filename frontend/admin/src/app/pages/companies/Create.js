import React from "react";
import Notice from "../../partials/content/Notice";
import CustomHead from "../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button as ButtonCore,
} from "@material-ui/core";
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
import {Link, withRouter} from 'react-router-dom'
import {list, post} from "../../crud/api";
import Select from 'react-select';


class Create extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            company: {is_active: 0},
            validated: false,
            action: '',
            specialities: [],
            speciality: [],
            countries: [],
            country: {label: 'Select Country', value: 0},
            states: [],
            state: {label: 'Select State', value: 0},
            cities: [],
            city: {label: 'Select City', value: 0},
            selectedFile: null,
            previewFile: null,
        };

        //this.getSpecialities();
        //this.getCountries();
        this.loadModels();
    }

    loadModels() {
        let models = {
            'AbSpecialities': {},
            'AbCountries': {},
        }
        post('abmodels', {models: models}).then(function (response) {
            let AbEngineManufactures = [];
            for (let opt in response.data) {

                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;
                })
            }
            this.setState({
                countries: response.data.AbCountries,
                specialities: response.data.AbSpecialities,
            })
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
        if(attr === 'website'){
            if(val.indexOf('http:') === -1 && val.indexOf('https:') === -1){
                val = 'http://' + val;
            }
        }
        company[attr] = val;
        this.setState({company: company})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        if (!this.state.selectedFile)
            delete this.state.company.file;
        post('companies', this.state.company).then(
            (response) => {
                this.setState({company: response.data});
                this.state.action == 'save_new' ? this.clearForm("parts-form") : this.props.data.history.push("/admin/companies");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    fileChangedHandler = (event) => {
        let company = this.state.company;
        let file = event.target.files[0];
        this.setState({
            previewFile: URL.createObjectURL(file)
        });
        if (file != undefined) {
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
        company.file = {}
        this.setState({selectedFile: null, company: company})
        document.getElementById('company-image-upload').value = '';
    }
    clearForm = (id) => {
        this.props.data.history.replace("/admin/companies");
        this.props.data.history.replace("/admin/companies");
    }

    render() {
        const {selectedFile, company, specialities, speciality, countries, country, states, state, city, cities} = this.state;
        return (
            <Form
                noValidate
                id="companies-form"
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
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="8">
                        <Form.Label>Speciality *</Form.Label>
                        <Select
                            required
                            value={speciality ? speciality : ''}
                            model="specialities"
                            name="speciality"
                            onChange={e => this.selectSpeciality(e, 'speciality')}
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
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Country</Form.Label>
                        <Select
                            value={country}
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
                                      onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
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
                                                    data-dz-name>{selectedFile ? selectedFile.name : 'No file selected'}</span>
                                                <strong>(<span
                                                    data-dz-size>{selectedFile && selectedFile.size_c ? selectedFile.size_c : ''}</span>)</strong>
                                            </div>
                                            <div className="dropzone-error"
                                                 data-dz-errormessage>{selectedFile && selectedFile.error ? selectedFile.error : ''}</div>
                                        </div>
                                        <div className="dropzone-toolbar">
                                            <span onClick={(e) => this.handleFileRemove(e)} className="dropzone-delete"
                                                  data-dz-remove><i className="flaticon2-cross"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="form-text text-muted">Max file size is 2MB.</span>
                        </div>
                    </div>
                </Form.Group>
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

                <Link to={"/admin/companies"} className="btn btn-danger">
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
                                console.log(error);
                                return <li key={index + i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
                            });
                        })
                    }
                </Notice>

                <div className="row">
                    <div className="col-md-12">
                        <CustomHead
                            beforeCodeTitle={"Company"}
                            jsCode={<div className="kt-portlet__head-toolbar">
                                <div className="kt-portlet__head-wrapper">
                                    <div className="kt-portlet__head-actions">
                                        <div className="dropdown dropdown-inline">
                                            <Link to={"/admin/companies"} className="btn btn-clean btn-icon-sm">
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