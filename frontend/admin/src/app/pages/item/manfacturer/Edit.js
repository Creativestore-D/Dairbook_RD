import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button as ButtonCore,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, patch, MEDIA_URL, post} from "../../../crud/api";
import Select from 'react-select';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";


class Edit extends React.Component {
    constructor(props) {
        super(props);

        const {manufacturer_id, type} = this.props.data.match.params
        this.state = {
            validated: false,
            manufacturer: {id: manufacturer_id},
            type: type,
            countries: [],
            country: {},
            categories: [],
            selected_categories: [],
            selectedFile: null,
            previewFile: null,
        };

        //this.getCountries();
        //this.getCategories();
      this.getManufacturer(manufacturer_id);
    }

    getCountries() {
        let filter = {'is_active': 1};
        list('countries', filter).then(function (response) {
            let data = response.data;
            let country = {};
            for (let opt in data) {
                data[opt].label = data[opt].name;
                data[opt].value = data[opt].id;
            }
            this.setState({countries: data});
            this.getManufacturer(this.state.manufacturer.id);

        }.bind(this));
    }

    getCategories() {
        let filter = {'is_active': 1, 'type': this.state.type};
        list('category', filter).then(function (response) {
            let data = response.data;
            for (let opt in data) {
                data[opt].label = data[opt].name;
                data[opt].value = data[opt].id;
            }
            this.setState({categories: data});


        }.bind(this));
    }

    selectCountry(value, key) {
        let manufacturer = this.state.manufacturer;
        manufacturer.country = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', manufacturer: manufacturer});
    };

    selectCategory(value, key) {
        let manufacturer = this.state.manufacturer;
        manufacturer.categories = [];
        console.log(value);
        // here need selected manufacturer ids
        for (let i in value) {
            manufacturer.categories.push(value[i].id);
        }
        this.setState({[key]: value, manufacturer: manufacturer});
    };

    getManufacturer(manufacturer_id) {
        list('manufacturer/' + manufacturer_id + '/').then(
            (response) => {
                delete response.data.type;
                let selected_categories = [];
                let cat_ids = [];
                let country = {id: response.data.country.id, label: response.data.country.name};
                this.setState({previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null})
                for (let i in response.data.categories) {
                    selected_categories.push({
                        id: response.data.categories[i].id,
                        label: response.data.categories[i].name
                    });

                    cat_ids.push(selected_categories[i].id);
                }
                response.data.categories = cat_ids;
                //response.data.country = response.data.country.id;
                this.setState({
                    manufacturer: response.data,
                    selected_categories: selected_categories,
                    //country: country
                });
                this.setSelectfile();
                this.loadModels();
            });
    }

    loadModels() {
        let manufacturer_data = this.state.manufacturer;
        let models = {
            'AbCategories':{type: this.state.type},
            'AbCountries': {},
        }

        let state_endpoints = {
            //AbCategories: ['categories'],
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
                            if (opt === key && manufacturer_data[state] !== null && manufacturer_data[state].id !== undefined && manufacturer_data[state].id === row.id)
                                newStates[state] = row;
                        })
                    })
                })
            }
            newStates['countries'] = response.data.AbCountries;
            newStates['categories'] = response.data.AbCategories;
            this.setState(newStates);
        }.bind(this))
    }

    handleChange(event) {
        var manufacturer = this.state.manufacturer;
        var attr = event.target.name;
        var val = event.target.value;
        if (attr === 'is_active')
            val = parseInt(val);

        manufacturer[attr] = val;
        this.setState({manufacturer: manufacturer})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        this.checkDataFormat(); // this is done to convert foregin table objects into pk
        patch('manufacturer/' + this.state.manufacturer.id + '/', this.state.manufacturer).then(
            (response) => {
                delete response.data.type;
                this.setState({manufacturer: response.data});
                this.props.data.history.push("/admin/" + this.state.type + "/manufacturer");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    checkDataFormat() {
      let manufacturer = this.state.manufacturer;
      let related_data = ['country'];
      related_data.map((val, i) => {
        manufacturer[val] = this.state[val].value;
      })
      this.setState({manufacturer:manufacturer});
    }

    setSelectfile() {
        if (this.state.manufacturer.media) {
            let file = {};
            let filename_pieces = this.state.manufacturer.media.original_file_name.split('/');
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
            let manufacturer = this.state.manufacturer;
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                manufacturer.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    manufacturer.file = reader.result;
                    this.setState({selectedFile: file, manufacturer: manufacturer});
                };
            }
        }
    }

    handleFileRemove = (event) => {
        let manufacturer = this.state.manufacturer;
        delete manufacturer.file
        this.setState({selectedFile: null, manufacturer: manufacturer, previewFile: null})
        document.getElementById('manufacturer-image-upload').value = '';
    }

    render() {
        const {manufacturer, countries, categories, selected_categories, country, selectedFile} = this.state;
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
                            model="manufacturer"
                            name="name"
                            defaultValue={manufacturer ? manufacturer.name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Established</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="manufacturer"
                            name="established"
                            defaultValue={manufacturer ? manufacturer.established : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group><Form.Group as={Col} md="4">
                    <Form.Label>Country</Form.Label>
                    <Select
                        model="countries"
                        value={country}
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
                        <Form.Label>Category *</Form.Label>
                        <Select
                            model="categories"
                            value={selected_categories}
                            name="category"
                            isClearable = {true}
							escapeClearsValue = {true}
                            onChange={e => this.selectCategory(e, 'selected_categories')}
                            options={categories}
                            isMulti
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3"
                                      required
                                      placeholder=""
                                      model="manufacturer"
                                      name="description"
                                      defaultValue={manufacturer ? manufacturer.description : ''}
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
                            id="manufacturer-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="manufacturer-image-upload">
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
                                value={manufacturer.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/" + this.state.type + "/manufacturer"} className="btn btn-danger">
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
        const buttons = <Link to={"/admin/" + this.state.type + "/manufacturer"} className="btn btn-clean btn-icon-sm">
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
                            beforeCodeTitle={this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1) + ' Manufacturer'}
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
