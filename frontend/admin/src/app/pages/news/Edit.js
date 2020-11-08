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

        const {news_id} = this.props.data.match.params
        this.state = {
            validated: false,
            news: {id: news_id},
            companies: [],
            company: {label: 'Select Company', value: 0},
            categories: [],
            category: [],
            continents: [],
            continent: {label: 'Select Continent', value: 0},
            regions: [],
            region: {label: 'Select Region', value: 0},
            countries: [],
            country: {label: 'Select Country', value: 0},
            selectedFile: null,
            previewFile: null,
            newsDate: new Date(),
        };

        //this.getCompanies();
        // this.getCategories();
        //this.getContinents();

        this.getNews(news_id);
    }

    getNews(news_id) {
        list('news/' + news_id + '/').then(
            (response) => {
                //delete response.data.news;
                delete response.data.views;

                let categories_ids = [];
                let category = [];
                for (let i in response.data.categories) {
                    category.push({id: response.data.categories[i].id, label: response.data.categories[i].name});
                    categories_ids.push(response.data.categories[i].id);
                }
                delete response.data.categories;
                response.data.categories = categories_ids;

                /*let company = this.state.company;
                company = {id: response.data.company.id, label: response.data.company.name};
                response.data.company = response.data.company.id;

                let continent = this.state.continent;
                continent = {id: response.data.continent.id, label: response.data.continent.name};
                response.data.continent = response.data.continent.id;

                let region = this.state.region;
                region = {id: response.data.region.id, label: response.data.region.name};
                response.data.region = response.data.region.id;

                let country = this.state.country;
                country = {id: response.data.country.id, label: response.data.country.name};
                response.data.country = response.data.country.id;*/

                this.setState({
                    newsDate: moment(response.data.date, 'YYYY-MM-DD'),
                    news: response.data,
                    category: category,
                    previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null
                });
                this.setSelectfile();
                //this.getRegions(response.data.continent);
                //this.getCountries(response.data.region);
                this.loadModels();
            });
    }

    loadModels() {
        let news_data = this.state.news;
        let models = {
            'AbCategories': {type: 'news'},
            'AbCompanies': {},
            'AbContinents': {},
            'AbRegions': {continent_id: news_data.continent && news_data.continent.id ? news_data.continent.id : 0},
            'AbCountries': {region_id: news_data.region && news_data.region.id ? news_data.region.id : 0},
        }
        let state_endpoints = {
            AbCompanies: ['company'],
            AbContinents: ['continent'],
            AbCountries: ['country'],
            AbRegions: ['region']
        }
        post('abmodels', {models: models}).then(function (response) {
            let newStates = {};
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;

                    Object.keys(state_endpoints).map((key, i) => {
                        state_endpoints[key].map((state, index) => {
                            if (opt === key && news_data[state] !== null && news_data[state].id !== undefined && news_data[state].id === row.id)
                                newStates[state] = row;
                        })
                    })

                })
            }
            newStates['countries'] = response.data.AbCountries;
            newStates['continents'] = response.data.AbContinents;
            newStates['regions'] = response.data.AbRegions;
            newStates['categories'] = response.data.AbCategories;
            newStates['companies'] = response.data.AbCompanies;
            this.setState(newStates);
        }.bind(this))
    }

    selectChange(value, key) {
        let news = this.state.news;
        news[key] = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', news: news});
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
                        [list_to_update]: response.data[opt], [key_to_update]: selected
                    })
                }
            }.bind(this));
        }
    }

    //get all Specialities List
    getCompanies() {
        let filter = {'is_active': 1, records: 'all'};
        list('companies', filter).then(function (response) {
            let data = response.data;
            for (let opt in data) {
                data[opt].label = data[opt].name;
                data[opt].value = data[opt].id;
            }
            this.setState({companies: data});

        }.bind(this));
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
        this.checkDataFormat(); // this is done to convert foregin table objects into pk
        patch('news/' + this.state.news.id + '/', this.state.news).then(
            (response) => {
                this.setState({news: response.data});
                this.props.data.history.push("/admin/news");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    checkDataFormat() {
        let news = this.state.news;
        let related_data = ['continent', 'region', 'country', 'company'];
        related_data.map((val, i) => {
            news[val] = this.state[val].value;
        })
        this.setState({news: news});
    }

    setSelectfile() {
        if (this.state.news.media) {
            let file = {};
            let filename_pieces = this.state.news.media.original_file_name.split('/');
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
            let news = this.state.news;
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
        delete news.file
        this.setState({selectedFile: null, news: news, previewFile: null})
        document.getElementById('news-image-upload').value = '';
    }

    render() {
        const {news, company, companies, countries, country, categories, category, continents, continent, regions, region, newsDate, selectedFile} = this.state;
        console.log(news, 'nnnnwsasd')
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
                            model="news"
                            name="title"
                            value={news ? news.title : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Date</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    minDate={newsDate}
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
                            value={company ? company : ''}
                            model="companies"
                            name="company"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            styles = {customStyles}
                            onChange={e => this.selectCompany(e, 'company')}
                            options={companies}
                        />
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
                            value={continent ? continent : ''}
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
                    <Form.Group as={Col} md="12">
                        <Form.Label>Source</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="news"
                            name="source"
                            value={news ? news.source : ''}
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
                            data={news.details ? news.details : ''}
                            onInit={editor => {
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
                                value={news.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/news"} className="btn btn-danger">
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
        const buttons = <Link to={"/admin/news"} className="btn btn-clean btn-icon-sm">
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
                            beforeCodeTitle={'News'}
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