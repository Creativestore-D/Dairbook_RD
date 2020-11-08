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
import {list, patch, SECTIONS, MEDIA_URL} from "../../../crud/api";
import Select from 'react-select';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";

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

        const {cms_id} = this.props.data.match.params
        this.state = {
            validated: false,
            cms: {id: cms_id},
            selectedFile: null,
            previewFile: null,
            section: {label: 'Select Section', value: 'Select Section'},
        };
        this.getCMS(cms_id);
    }

    selectSection(value, key) {
        let cms = this.state.cms;
        cms.section = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', cms: cms});
    }

    getCMS(cms_id) {
        list('cms/' + cms_id + '/').then(
            (response) => {
                let section = this.state.section;
                SECTIONS.map((index) => {
                    if (index.label === response.data.section) {
                        section = {label: index.label, value: index.value};
                        response.data.section = index.value;
                    }
                });
                this.setState({
                    cms: response.data,
                    section: section,
                    previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null
                })
                this.setSelectfile();
            });
    }

    handleChange(event) {
        var cms = this.state.cms;
        var attr = event.target.name;
        var val = event.target.value;
        if (attr === 'is_active')
            val = parseInt(val);

        cms[attr] = val;
        this.setState({cms: cms})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        patch('cms/' + this.state.cms.id + '/', this.state.cms).then(
            (response) => {
                this.setState({cms: response.data});
                this.props.data.history.push("/admin/cms");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    setSelectfile() {
        if (this.state.cms.media) {
            let file = {};
            let filename_pieces = this.state.cms.media.original_file_name.split('/');
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
            let cms = this.state.cms;
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                cms.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    cms.file = reader.result;
                    this.setState({selectedFile: file, cms: cms});
                };
            }
        }
    }

    handleFileRemove = (event) => {
        let cms = this.state.cms;
        delete cms.file
        this.setState({selectedFile: null, cms: cms, previewFile: null})
        document.getElementById('cms-image-upload').value = '';
    }

    render() {
        const {cms, section, selectedFile} = this.state;
        return (
            <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Page Url *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="cms"
                            name="url"
                            value={cms.url}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="cms"
                            name="title"
                            value={cms.title}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Sub Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="cms"
                            name="sub_title"
                            value={cms.sub_title}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Section *</Form.Label>
                        <Select
                            value={section}
                            model="cms"
                            name="section"
                            isClearable={true}
                            escapeClearsValue={true}
                            styles={customStyles}
                            onChange={e => this.selectSection(e, 'section')}
                            options={SECTIONS}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Custom Url</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            model="cms"
                            name="custom_url"
                            value={cms.custom_url}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <Form.Label>Content Body</Form.Label>
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfiguration}
                            data={cms.body ? cms.body : ''}
                            onInit={editor => {
                                // You can store the "editor" and use when it is needed.
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                this.state.cms.body = data;
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
                            id="cms-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="cms-image-upload">
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
                                value={cms.is_active === 1 ? '1' : '0'}
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

                <Link to={"/admin/cms"} className="btn btn-danger">
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
        const buttons = <Link to={"/admin/cms"} className="btn btn-clean btn-icon-sm">
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
                            beforeCodeTitle={'CMS'}
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