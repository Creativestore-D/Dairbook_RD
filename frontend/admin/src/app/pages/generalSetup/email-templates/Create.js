import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
    Button as ButtonCore,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom';
import { list, post, MESSAGE_TYPES } from "../../../crud/api";
import Select from 'react-select';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
      emailTemplate:{is_active: 0, location: 'templates/'},
      validated: false,
      action:'',
      messageType:{label:'Select Message Type', value:''},
      messageTypes: MESSAGE_TYPES,
    };
  }

  handleChange(event) {
    var emailTemplate = this.state.emailTemplate;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);
    emailTemplate[attr] = val;
    this.setState({emailTemplate : emailTemplate})
  }

  selectMessageType(value, key) {
    let emailTemplate = this.state.emailTemplate;
    emailTemplate.message_type = value && value.value ? value.value : '';
    this.setState({ [key]: value ? value : '', emailTemplate: emailTemplate});
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    post('emails', this.state.emailTemplate).then(
      (response) => {
        this.setState({emailTemplate : response.data});
        this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm("email-template-form"):"/admin/email-template");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }
  clearForm = (id) => { 
      document.getElementById(id).reset();
      this.setState({selectedFile: null, previewFile: null});
    }
  render() {
    const { validated, emailTemplate, messageType, messageTypes} = this.state;
    return (
      <Form
        noValidate
        id = "email-template-form"
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="4">
              <Form.Label>Message Type*</Form.Label>
                <Select
                  value={messageType}
                  name="message_type"
                  isClearable = {true}
                  escapeClearsValue = {true}
                  styles = {customStyles}
                  onChange={e => this.selectMessageType(e, 'messageType')}
                  options={messageTypes}
                />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Mail Subject *</Form.Label>
            <Form.Control
                required
              type="text"
              placeholder=""
              name="subject"
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Sending Email *</Form.Label>
            <Form.Control
                required
              type="text"
              placeholder=""
              name="sending_email"
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="12">
            <Form.Label>Message</Form.Label>
            <CKEditor
                    editor={ ClassicEditor }
                    config = { editorConfiguration }
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        this.state.emailTemplate.message = data;
                    } }
                />
          </Form.Group>
          <Form.Group as={Col} md="12">
            <FormControl component="fieldset" className="col-md-12">
              <RadioGroup
                aria-label="status"
                name="is_active"
                className="col-md-12"
                value={emailTemplate.is_active === 1 ? '1' : '0'}
                onChange={e => this.handleChange(e)}
              >
                <FormControlLabel className="col-md-2" value="1" control={<Radio />} label="Publish" />
                <FormControlLabel className="col-md-2" value="0" control={<Radio />} label="Inactive" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
        </Form.Row>
        <Button type="submit" onClick={(e) => this.setState({action:'save'})} className="btn btn-primary">
          <i className="la la-save" />
          Save & Close
        </Button>
        &nbsp;&nbsp;

        <Button type="submit" onClick={(e) => this.setState({action:'save_new'})} className="btn btn-success">
          <i className="la la-save" />
          Save & New
        </Button>
        &nbsp;&nbsp;

        <Link to={"/admin/email-template"} className="btn btn-danger">
          <i className="la la-remove" />
          Cancel
        </Link>
      </Form>
    );
  }
}

class CreatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {errors:{}, showError:false};
    this.sendError = this.sendError.bind(this);
  }

  sendError(error) {
    if(Object.keys(error).length)
      this.setState({showError:true});

    this.setState({errors:error});
  }

  render() {
    return (
      <>
        <Notice icon="flaticon-warning kt-font-primary" style={{display: this.state.showError ? 'flex' : 'none' }}>
        { 
          Object.keys(this.state.errors).map((key, index) => {
            return this.state.errors[key].map((error, i) => {
              console.log(error);
              return <li key={index+i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
            });
          })
        }
        </Notice>

        <div className="row">
          <div className="col-md-12">
            <CustomHead
              beforeCodeTitle={"Email Template"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/admin/email-template"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                  </div>
                </div>
              </div>
            </div>
            }>
              <div className="kt-section">
                <Create data={this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(CreatePage);