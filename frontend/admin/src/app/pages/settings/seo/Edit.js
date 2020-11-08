import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl, Button as ButtonCore,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, patch, PAGES, MEDIA_URL} from "../../../crud/api";
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
import Select from 'react-select';

class Edit extends React.Component {
    constructor(props) {
        super(props);

        const {seo_id} = this.props.data.match.params
        this.state = {
            validated: false,
            seos: {id: seo_id},
        };
        this.getSeo(seo_id);
    }

    selectPage(value, key) {
        let seos = this.state.seos;
        seos.model_id = value && value.value ? value.value : '';
        seos.model_type = value && value.label ? value.label : '';
        this.setState({[key]: value, seos: seos});
    }

    getSeo(seo_id) {
        list('seos/' + seo_id + '/').then(
            (response) => {
                let page = this.state.page;
                PAGES.map((index) => {
                    if (index.label === response.data.model_type) {
                        page = {label: index.label, value: index.value};
                        response.data.model_id = index.value;
                        response.data.model_type = index.label;
                    }
                });
                this.setState({
                    seos: response.data,
                    page: page,
                    previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null
                })
                this.setSelectfile();
            });
    }

    handleChange(event) {
        var seos = this.state.seos;
        var attr = event.target.name;
        var val = event.target.value;
        if (attr === 'is_active')
            val = parseInt(val);

        seos[attr] = val;
        this.setState({seos: seos})
    }

    fileChangedHandler = (event) => {
        let seos = this.state.seos;
        let file = event.target.files[0];
        this.setState({
            previewFile: URL.createObjectURL(file)
        });
        if (file != undefined) {
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                seos.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    seos.file = reader.result;
                    this.setState({selectedFile: file, seos: seos});
                };
            }
        }
    }
    handleFileRemove = (event) => {
        let seos = this.state.seos;
        delete seos.file;
        this.setState({selectedFile: null, seos: seos})
        document.getElementById('seos-image-upload').value = '';
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        patch('seos/' + this.state.seos.id + '/', this.state.seos).then(
            (response) => {
                this.setState({seos: response.data});
                this.props.data.history.push("/admin/seos");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    setSelectfile() {
        if (this.state.seos.media) {
            let file = {};
            let filename_pieces = this.state.seos.media.original_file_name.split('/');
            file.name_c = filename_pieces[filename_pieces.length - 1];
            this.setState({selectedFile: file});
        }
    }

    render() {
        const {seos, page, selectedFile} = this.state;
        return (
            <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <Form.Group as={Col} md="3">
                        <Form.Label>Page *</Form.Label>
                        <Select
                            required
                            value={page}
                            model="seos"
                            name="page"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectPage(e, 'page')}
                            options={PAGES}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="9">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="seos"
                            name="title"
                            value={seos.title}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Description *</Form.Label>
                        <Form.Control as="textarea" rows="5"
                                      type="text"
                                      placeholder=""
                                      model="seos"
                                      name="description"
                                      value={seos.description}
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
                            id="seos-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="seos-image-upload">
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
                                                    <strong><span
                                                        data-dz-size>{selectedFile && selectedFile.size_c ? '(' + selectedFile.size_c + ')' : ''}</span></strong>
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

                <Link to={"/admin/seos"} className="btn btn-danger">
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
        const buttons = <Link to={"/admin/seos"} className="btn btn-clean btn-icon-sm">
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
                                return <li key={index + i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
                            });
                        })
                    }
                </Notice>

                <div className="row">
                    <div className="col-md-12">
                        <CustomHead
                            beforeCodeTitle={'Seo'}
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