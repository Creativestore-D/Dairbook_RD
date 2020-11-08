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

        const {type_id, type} = this.props.data.match.params
        this.state = {
            validated: false,
            types: {id: type_id},
            type: type,
            manufacturers: [],
            manufacturer: {},
            selectedFile: null,
            previewFile: null,
        };

        this.getType(type_id);
    }

    getManufacturers() {
        let filter = {'is_active': 1, 'type': this.state.type, records: 'all'};
        list('manufacturer', filter).then(function (response) {
            let data = response.data;
            for (let opt in data) {
                data[opt].label = data[opt].name;
                data[opt].value = data[opt].id;
            }
            this.setState({manufacturers: data});
            this.getType(this.state.types.id);

        }.bind(this));
    }

    loadModels() {
        let types_data = this.state.types;
        let models = {
            'AbManufacturers':{type: this.state.type},
        }

        let state_endpoints = {
            AbManufacturers: ['manufacturer'],
        }

        post('abmodels', {models: models}).then(function (response) {
            let newStates = {};
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;

                    Object.keys(state_endpoints).map((key, i) => {
                        state_endpoints[key].map((state, index) => {
                            if (opt === key && types_data[state] !== null && types_data[state].id !== undefined && types_data[state].id === row.id)
                                newStates[state] = row;
                        })
                    })
                })
            }
            newStates['manufacturers'] = response.data.AbManufacturers;
            this.setState(newStates);
        }.bind(this))
    }

    selectManufacturer(value, key) {
        let types = this.state.types;
        types.manufacturer = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', types: types});
    };

    //for getting the selected manufacturer from manufactures list
    getType(type_id) {
        list('type/' + type_id + '/').then(
            (response) => {
                delete response.data.type;
                //let manufacturer = {id: response.data.manufacturer.id, label: response.data.manufacturer.name};
                //response.data.manufacturer = response.data.manufacturer.id;
                this.setState({
                    types: response.data,
                    //manufacturer: manufacturer,
                    previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null
                })
                this.setSelectfile();
                this.loadModels();
            });
    }

    handleChange(event) {
        var types = this.state.types;
        var attr = event.target.name;
        var val = event.target.value;
        if (attr === 'is_active')
            val = parseInt(val);

        types[attr] = val;
        this.setState({types: types})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        patch('type/' + this.state.types.id + '/', this.state.types).then(
            (response) => {
                delete response.data.type;
                this.setState({types: response.data});
                this.props.data.history.push("/admin/" + this.state.type + "/type");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    setSelectfile() {
        if (this.state.types.media) {
            let file = {};
            let filename_pieces = this.state.types.media.original_file_name.split('/');
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
            let types = this.state.types;
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                types.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    types.file = reader.result;
                    this.setState({selectedFile: file, types: types});
                };
            }
        }
    }

    handleFileRemove = (event) => {
        let types = this.state.types;
        delete types.file
        this.setState({selectedFile: null, types: types, previewFile: null})
        document.getElementById('types-image-upload').value = '';
    }

    render() {
        const {types, manufacturers, manufacturer, selectedFile} = this.state;
        return (
            <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <Form.Group as={Col} md="6">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="types"
                            name="name"
                            value={types ? types.name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                        <Form.Label>Manufacturer *</Form.Label>
                        <Select
                            model="manufacturer"
                            value={manufacturer}
                            name="manufacturer"
                            isClearable = {true}
                            escapeClearsValue = {true}
                            onChange={e => this.selectManufacturer(e, 'manufacturer')}
                            options={manufacturers}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3"
                                      required
                                      placeholder=""
                                      model="types"
                                      name="description"
                                      value={types ? types.description : ''}
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
                            id="types-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="types-image-upload">
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
                                value={types.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/" + this.state.type + "/type"} className="btn btn-danger">
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
        const buttons = <Link to={"/admin/" + this.state.type + "/type"} className="btn btn-clean btn-icon-sm">
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
                            beforeCodeTitle={this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1) + ' Types'}
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
