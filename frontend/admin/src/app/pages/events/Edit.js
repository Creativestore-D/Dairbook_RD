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
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import DateFnsUtils from '@date-io/date-fns';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import blue from "@material-ui/core/colors/blue";
import moment from "moment";

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

class Edit extends React.Component {
    constructor(props) {
        super(props);

        const {event_id} = this.props.data.match.params
        this.state = {
            validated: false,
            _event: {id: event_id},
            categories: [],
            category: [],
            continents: [],
            continent: {label: 'Select Continent', value: null},
            regions: [],
            region: {label: 'Select Region', value: null},
            countries: [],
            country: {label: 'Select Country', value: null},
            states: [],
            state: {label: 'Select State', value: null},
            cities: [],
            city: {label: 'Select City', value: null},
            selectedFile: null,
            previewFile: null,
        };

        this.getEvents(event_id);
        //this.getCategories();
        //this.getContinents();
    }

    getEvents(event_id) {
        list('events/' + event_id + '/').then(
            (response) => {
                let category = [];
                let categories_ids = [];
                for (let i in response.data.categories) {
                    category.push({id: response.data.categories[i].id, label: response.data.categories[i].name});
                    categories_ids.push(response.data.categories[i].id);
                }
                response.data.categories = categories_ids;
                let website = response.data.website;
                if(website.indexOf('http:') === -1 && website.indexOf('https:') === -1){
                    website = 'http://' + website;
                    response.data.website = website;
                }

                /*let continent = {id: response.data.continent.id, label: response.data.continent.name};
                response.data.continent = response.data.continent.id;

                let region = {id: response.data.region.id, label: response.data.region.name};
                response.data.region = response.data.region.id;

                let country = {id: response.data.country.id, label: response.data.country.name};
                response.data.country = response.data.country.id;

                let state = {id: response.data.state.id, label: response.data.state.name};
                response.data.state = response.data.state.id;

                let city = {id: response.data.city.id, label: response.data.city.name};
                response.data.city = response.data.city.id;*/

                this.setState({
                    _event: response.data,
					category: category,
                    previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null
                });
                this.setSelectfile();
                this.loadModels();
                //this.getRegions(response.data.continent);
                //this.getCountries(response.data.region);
                //this.getStates(response.data.country);
                //this.getCities(response.data.state);
            });
    }

    loadModels() {
    	let event_data = this.state._event;
        let models = {
            'AbCategories': {type: 'event'},
            'AbContinents': {},
            'AbRegions': {continent_id : event_data.continent && event_data.continent.id ? event_data.continent.id : null},
            'AbCountries': {region_id : event_data.region && event_data.region.id ? event_data.region.id : null},
            'AbStates': {country_id : event_data.country && event_data.country.id ? event_data.country.id : null},
            'AbCities': {state_id : event_data.state && event_data.state.id ? event_data.state.id : null},
        }

        let state_endpoints = {
            AbContinents:['continent'],
            AbCountries:['country'],
            AbRegions:['region'],
            AbStates:['state'],
            AbCities:['city'],
        }

        post('abmodels', {models: models}).then(function (response) {
        	let newStates = {};
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;

                    Object.keys(state_endpoints).map((key, i) => {
                      state_endpoints[key].map((state, index) => {
                            if(opt === key && event_data[state] !== null && event_data[state].id !== undefined && event_data[state].id === row.id)
                              newStates[state] = row;
                      })
                    })
                })
            }
			newStates['countries'] = response.data.AbCountries;
            newStates['continents'] = response.data.AbContinents;
            newStates['regions'] = response.data.AbRegions;
            newStates['states'] = response.data.AbStates;
            newStates['cities'] = response.data.AbCities;
            newStates['categories'] = response.data.AbCategories;
            this.setState(newStates);
        }.bind(this))
    }

    selectChange(value, key) {
        let _event = this.state._event;
        _event[key] = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', _event: _event});
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
                        [list_to_update]: response.data[opt], [key_to_update]: selected
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

    handleChange(event, type) {
        var _event = this.state._event;
        if (type !== 'start_date' && type !== 'end_date') {
            var attr = event.target.name;
            var val = event.target.value;
        } else {
            var attr = type;
            var val = moment(event).format("YYYY-MM-DD");
            if (type === 'start_date') {
                this.setState({startDate: event})
                this.setState({endDate: event})
                _event['end_date'] = val;
            } else
                this.setState({endDate: event})
        }
        if (attr === 'is_active')
            val = parseInt(val);
        _event[attr] = val;
        this.setState({_event: _event})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        this.checkDataFormat(); // this is done to convert foregin table objects into pk
        patch('events/' + this.state._event.id + '/', this.state._event).then(
            (response) => {
                this.setState({_event: response.data});
                this.props.data.history.push("/admin/events");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    checkDataFormat() {
      let _event = this.state._event;
      let related_data = ['continent','region','country', 'state', 'city'];
      related_data.map((val, i) => {
        _event[val] = this.state[val].value;
      })
      this.setState({_event:_event});
    }

    setSelectfile() {
        if (this.state._event.media) {
            let file = {};
            let filename_pieces = this.state._event.media.original_file_name.split('/');
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
            let _event = this.state._event;
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
        delete _event.file
        this.setState({selectedFile: null, _event: _event, previewFile: null})
        document.getElementById('_event-image-upload').value = '';
    }

    render() {
        const {_event, countries, country, categories, category, continents, continent, regions, region, states, state, cities, city, selectedFile, startDate, endDate} = this.state;
        return (
            <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="events"
                            name="title"
                            value={_event.title}
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
                                    name="start_date"
                                    value={_event.start_date}
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
                                    minDate={startDate ? startDate : _event.end_date}
                                    name="end_date"
                                    value={endDate ? endDate : _event.end_date}
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
                            value={category ? category : ''}
                            placeholder='Select Category'
                            model="categories"
                            name="category"
                            onChange={e => this.selectCategory(e, 'category')}
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
                            value={continent}
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
                            value={region}
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
                            value={country}
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
                            value={state}
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
                            value={city}
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
                            model="_event"
                            name="website"
                            value={_event.website}
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
                            model="_event"
                            name="location"
                            value={_event.location}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Event Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="_event"
                            name="address"
                            value={_event.address}
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
                            data={_event.details ? _event.details : ''}
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
                                value={_event.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/events"} className="btn btn-danger">
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
        const buttons = <Link to={"/admin/events"} className="btn btn-clean btn-icon-sm">
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
                            beforeCodeTitle={'Event'}
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