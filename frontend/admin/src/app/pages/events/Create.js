import 'date-fns';
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
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import blue from "@material-ui/core/colors/blue";
import DateFnsUtils from '@date-io/date-fns';
import {Link, withRouter} from 'react-router-dom'
import {list, post} from "../../crud/api";
import Select from 'react-select';
import moment from "moment";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Alert from 'react-bootstrap/Alert';

const editorConfiguration = {
    /*toolbar: [
        {name:"document",items:["Source","-","Preview"]},
      {name:"clipboard",items:["Cut","Copy","Paste","PasteText","PasteFromWord","-","Undo","Redo"]},
      {name:"editing",items:["Find","Replace","-","SelectAll","-","Scayt"]},"/",
      {name:"basicstyles",items:["Bold","Italic","Underline","Strike","Subscript","Superscript","-","CopyFormatting","RemoveFormat"]},
      {name:"paragraph",items:["NumberedList","BulletedList","-","Outdent","Indent","-","Blockquote","CreateDiv","-","JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock","-","BidiLtr","BidiRtl","Language"]},
      {name:"links",items:["Link","Unlink","Anchor"]},
      {name:"insert",items:["base64image"]},"/",
      {name:"styles",items:["Styles","Format","Font","FontSize"]},
      {name:"colors",items:["TextColor","BGColor"]},
      {name:"tools",items:["Maximize","ShowBlocks"]}],height:300*/
};

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        zIndex: 99
    })
}

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
        super(props);
        this.state = {
            _event: {is_active: 0, start_date: moment(new Date()).format("YYYY-MM-DD"), end_date: moment(new Date()).format("YYYY-MM-DD")},
            validated: false,
            action: '',
            categories: [],
            selected_category: [],
            continents: [],
            selected_continent: {label: 'Select Continent', value: 0},
            regions: [],
            selected_region: {label: 'Select Region', value: 0},
            countries: [],
            selected_country: {label: 'Select Country', value: 0},
            selectedFile: null,
            previewFile: null,
            startDate: new Date(),
            endDate: new Date(),
            selected_state: {label: 'Select State', value: 0},
        };
        //this.getCategories();
        //this.getContinents();
        this.loadModels();
    }

    loadModels() {
        let models = {
            'AbCategories': {type: 'event'},
            'AbContinents': {},
        }
        post('abmodels', {models: models}).then(function (response) {
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;
                })
            }
            this.setState({
                categories: response.data.AbCategories,
                continents: response.data.AbContinents,
            })
        }.bind(this))
    }

    selectChange(value, key) {
        let _event = this.state._event;
        _event[key] = value && value.value ? value.value : '';
        this.setState({['selected_' + key]: value ? value : '', _event: _event});
        if (['continent', 'region', 'country', 'state'].indexOf(key) > -1 && value) {
            let endpoint = '', params = {}, key_to_update = '', list_to_update = '';
            let models = {};
            if (key === 'continent') {
                models = {
                    AbRegions: {continent_id: value.id}
                }
                key_to_update = 'region';
                list_to_update = 'regions';
            } else if (key === 'region') {
                models = {
                    AbCountries: {region_id: value.id}
                }
                key_to_update = 'country';
                list_to_update = 'countries';
            } else if (key === 'country') {
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

                        if (this.state._event[list_to_update] != undefined && row.id === this.state._event[list_to_update].id)
                            selected = row;
                    })

                    this.setState({
                        [list_to_update]: response.data[opt], ['selected_' + key_to_update]: selected
                    })
                }
            }.bind(this));
        }
    }

    selectCategory(value, key) {
        let _event = this.state._event;
        _event.categories = [];
        for (let i in value) {
            _event.categories.push(value[i].id);
        }
        this.setState({[key]: value, _event: _event});
    }

    handleChange(e, type) {
        var _event = this.state._event;
        if (type !== 'start_date' && type !== 'end_date') {
            var attr = e.target.name;
            var val = e.target.value;
        } else {
            var attr = type;
            var val = moment(e).format("YYYY-MM-DD");
            if (type === 'start_date') {
                this.setState({startDate: e})
                this.setState({endDate: e})
                _event['end_date'] = val;
            } else
                this.setState({endDate: e})
        }
        if (attr === 'is_active')
            val = parseInt(val);
        if(attr === 'website'){
            if(val.indexOf('http:') === -1 && val.indexOf('https:') === -1){
                val = 'http://' + val;
            }
        }
        _event[attr] = val;
        this.setState({_event: _event})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        post('events', this.state._event).then(
            (response) => {
                this.setState({_event: response.data, alert_status: 'show'});
                this.state.action == 'save_new' ? this.clearForm("parts-form") : this.props.data.history.push("/admin/events");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    fileChangedHandler = (event) => {
        let _event = this.state._event;
        let file = event.target.files[0];
        this.setState({
            previewFile: URL.createObjectURL(file)
        });
        if (file != undefined) {
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                _event.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    _event.file = reader.result;
                    this.setState({selectedFile: file, _event: _event});
                };
            }
        }
    }

    handleFileRemove = (event) => {
        let _event = this.state._event;
        _event.file = {}
        this.setState({selectedFile: null, _event: _event})
        document.getElementById('_event-image-upload').value = '';
    }
    clearForm = (id) => {
        this.props.data.history.replace("/admin/events");
        this.props.data.history.replace("/admin/events");
    }

    render() {
        const {
            _event, states, selected_state, cities, selected_city, categories, selected_category, continents,
            selected_continent, regions, selected_region, countries, selected_country, startDate, endDate, selectedFile
        } = this.state;
        return (
            <Form
                noValidate
                id="events-form"
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
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="events"
                            name="title"
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Start Date</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    format="dd/MM/yyyy"
                                    minDate={new Date()}
                                    disablePast={true}
                                    name="start_date"
                                    value={startDate}
                                    onChange={e => this.handleChange(e, 'start_date')}
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>End Date</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    format="dd/MM/yyyy"
                                    minDate={startDate ? startDate : new Date()}
                                    disablePast={true}
                                    name="end_date"
                                    value={endDate}
                                    onChange={e => this.handleChange(e, 'end_date')}
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Category *</Form.Label>
                        <Select
                            required
                            value={selected_category ? selected_category : ''}
                            placeholder='Select Category'
                            model="categories"
                            name="category"
                            onChange={e => this.selectCategory(e, 'selected_category')}
                            options={categories}
                            isMulti
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Continent *</Form.Label>
                        <Select
                            required
                            value={selected_continent}
                            model="continents"
                            name="continent"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            styles = {customStyles}
                            onChange={e => this.selectChange(e, 'continent')}
                            options={continents}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Region *</Form.Label>
                        <Select
                            required
                            value={selected_region}
                            model="regions"
                            name="region"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            styles = {customStyles}
                            onChange={e => this.selectChange(e, 'region')}
                            options={regions}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Country *</Form.Label>
                        <Select
                            value={selected_country}
                            model="countries"
                            name="country"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            styles = {customStyles}
                            onChange={e => this.selectChange(e, 'country')}
                            options={countries}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>State</Form.Label>
                        <Select
                            value={selected_state}
                            model="states"
                            name="state"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            styles = {customStyles}
                            onChange={e => this.selectChange(e, 'state')}
                            options={states}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>City</Form.Label>
                        <Select
                            value={selected_city}
                            model="cities"
                            name="city"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            styles = {customStyles}
                            onChange={e => this.selectChange(e, 'city')}
                            options={cities}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="events"
                            name="website"
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Location (Latitude and Longitude)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="events"
                            name="location"
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Event Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="events"
                            name="address"
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Details</Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfiguration}
                            onInit={editor => {
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                this.state._event.details = data;
                            }}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <input
                            accept="image/*"
                            style={{display: 'none'}}
                            type="file"
                            id="_event-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="_event-image-upload">
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
                                value={_event.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/events"} className="btn btn-danger">
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
                            beforeCodeTitle={"Events"}
                            jsCode={<div className="kt-portlet__head-toolbar">
                                <div className="kt-portlet__head-wrapper">
                                    <div className="kt-portlet__head-actions">
                                        <div className="dropdown dropdown-inline">
                                            <Link to={"/admin/events"} className="btn btn-clean btn-icon-sm">
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