import React, {Fragment} from "react";
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
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import moment from "moment";
import Alert from 'react-bootstrap/Alert';

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

class Create extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            news: {is_active: 0, views: 0, date: moment(new Date()).format("YYYY-MM-DD")},
            validated: false,
            action: '',
            companies: [],
            selected_company: {label: 'Select Company', value: 0},
            categories: [],
            selected_category: [],
            continents: [],
            selected_continent: {label: 'Select Continent', value: 0},
            regions: [],
            selected_region: {label: 'Select Region', value: 0},
            countries: [],
            selected_country: {label: 'Select Country', value: 0},
            newsDate: new Date(),
            editorInstance: ''
        };

        //this.getCompanies();
        //this.getCategories();
        //this.getContinents();
        this.loadModels();
    }

    loadModels() {
        let models = {
            'AbCategories': {type: 'news'},
            'AbContinents': {},
            'AbCompanies': {},
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
                companies: response.data.AbCompanies,
            })
        }.bind(this))
    }

    selectCompany(value, key) {
        let news = this.state.news;
        news.company = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', news: news});
    }

    selectCategory(value, key) {
        let news = this.state.news;
        news.categories = [];
        for (let i in value) {
            news.categories.push(value[i].id);
        }
        this.setState({[key]: value, news: news});
    }


    selectChange(value, key) {
        let news = this.state.news;
        news[key] = value && value.value ? value.value : '';
        this.setState({['selected_' + key]: value ? value : '', news: news});
        if (['continent', 'region'].indexOf(key) > -1 && value) {
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
            }

            post('abmodels', {models: models}).then(function (response) {
                let selected = {};
                for (let opt in response.data) {
                    response.data[opt].map((row, i) => {
                        response.data[opt][i].label = row.name;
                        response.data[opt][i].value = row.id;

                        if (this.state.news[list_to_update] != undefined && row.id === this.state.news[list_to_update].id)
                            selected = row;
                    })

                    this.setState({
                        [list_to_update]: response.data[opt], ['selected_' + key_to_update]: selected
                    })
                }
            }.bind(this));
        }
    }

    selectContinent(value, key) {
        let news = this.state.news;
        news.continent = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', news: news});
        this.getRegions(value && value.value ? value.value : '');
    }

    //get all Regions List
    getRegions(continent_id) {
        let filter = {'is_active': 1, continent_id, records: 'all'};
        list('region', filter).then(function (response) {
            let data = response.data;
            for (let opt in data) {
                data[opt].label = data[opt].name;
                data[opt].value = data[opt].id;
            }
            this.setState({regions: data});

        }.bind(this));
    }

    selectRegion(value, key) {
        let news = this.state.news;
        news.region = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', news: news});
        this.getCountries(value && value.value ? value.value : '');
    }

    // get all Countries List
    getCountries(region_id) {
        let filter = {'is_active': 1, region_id, records: 'all'};
        list('countries', filter).then(function (response) {
            let data = response.data;
            for (let opt in data) {
                data[opt].label = data[opt].name;
                data[opt].value = data[opt].id;
            }
            this.setState({countries: data});

        }.bind(this));
    }

    selectCountry(value, key) {
        let news = this.state.news;
        news.country = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', news: news});
    }


    handleChange(event, type) {
        var news = this.state.news;
        if (type !== 'date') {
            var attr = event.target.name;
            var val = event.target.value;
        } else {
            var attr = type;
            var val = moment(event).format("YYYY-MM-DD");
            this.setState({newsDate: event})
        }
        if (attr === 'is_active')
            val = parseInt(val);
        news[attr] = val;
        this.setState({news: news})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        post('news', this.state.news).then(
            (response) => {
                this.setState({news: response.data, alert_status: 'show'});
                this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm("create-news-form") : "/admin/news");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    fileChangedHandler = (event) => {
        let news = this.state.news;
        let file = event.target.files[0];
        this.setState({
            previewFile: URL.createObjectURL(file)
        });
        if (file != undefined) {
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                news.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    news.file = reader.result;
                    this.setState({selectedFile: file, news: news});
                };
            }
        }
    }

    handleFileRemove = (event) => {
        let news = this.state.news;
        news.file = {}
        this.setState({selectedFile: null, news: news})
        document.getElementById('news-image-upload').value = '';
    }
    clearForm = (id) => {
        document.getElementById(id).reset();
        const date = new Date();
        let editor = this.state.editorInstance;
        editor.setData('');
        this.setState({
            selectedFile: null,
            previewFile: null,
            selected_company: {label: 'Select Company', value: 0},
            selected_category: [],
            selected_continent: {label: 'Select Continent', value: 0},
            selected_region: {label: 'Select Region', value: 0},
            selected_country: {label: 'Select Country', value: 0},
            newsDate: date,
        });
        setTimeout(() => {
            this.setState({alert_status: 'hide'});
        }, 3000);
    }

    render() {
        const {
            selectedFile, news, companies, selected_company, categories, selected_category, continents, selected_continent,
            regions, selected_region, countries, selected_country, newsDate
        } = this.state;
        return (
            <Form
                noValidate
                id="create-news-form"
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
                            model="news"
                            name="title"
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Date</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    minDate={new Date('1990-01-01')}
                                    value={newsDate}
                                    format="dd/MM/yyyy"
                                    onChange={e => this.handleChange(e, 'date')}
                                    animateYearScrolling
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Company</Form.Label>
                        <Select
                            value={selected_company ? selected_company : ''}
                            model="companies"
                            name="company"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            styles = {customStyles}
                            onChange={e => this.selectCompany(e, 'selected_company')}
                            options={companies}
                        />
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
                            onChange={e => this.selectCountry(e, 'selected_country')}
                            options={countries}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Source</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="news"
                            name="source"
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
                            data={''}
                            onInit={editor => {
                                // You can store the "editor" and use when it is needed.
                                this.state.editorInstance = editor;
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                this.state.news.details = data;
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
                            id="news-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="news-image-upload">
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
                                value={news.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/news"} className="btn btn-danger">
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
                            beforeCodeTitle={"News"}
                            jsCode={<div className="kt-portlet__head-toolbar">
                                <div className="kt-portlet__head-wrapper">
                                    <div className="kt-portlet__head-actions">
                                        <div className="dropdown dropdown-inline">
                                            <Link to={"/admin/news"} className="btn btn-clean btn-icon-sm">
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