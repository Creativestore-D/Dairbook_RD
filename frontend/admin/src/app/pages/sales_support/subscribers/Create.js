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
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";
import { Link, withRouter } from 'react-router-dom'
import { list, post } from "../../../crud/api";



class Create extends React.Component {

  constructor(props) {
    super(props);
    const type = this.props.data.match.params.type;
    this.state = {
      type : type,
      subscriber:{type: type, is_active: 0},
      validated: false,
      action:'',
      selectedFile: null,
    };

  }

  handleChange(event) {
    var subscriber = this.state.subscriber;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    subscriber[attr] = val;
    this.setState({subscriber : subscriber})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    post('subscribers', this.state.subscriber).then(
      (response) => {
        this.setState({subscriber : response.data});
        this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm("create-subscriber-form"):"/admin/subscriber");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  fileChangedHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    console.log(event.target.files[0] );
  }
  clearForm = (id) => { 
      document.getElementById(id).reset();
      this.setState({selectedFile: null, previewFile: null});
    }
  render() {
    const { subscriber } = this.state;
    return (
      <Form
        noValidate
        id = "create-subscriber-form"
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="6">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="subscriber"
              name="name"
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="subscriber"
              name="email"
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="12">
            <Form.Label>Comments</Form.Label>
            <Form.Control as="textarea" rows="5"
              model="subscriber"
              name="comments"
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="12">
            <FormControl component="fieldset" className="col-md-12">
              <RadioGroup
                aria-label="status"
                name="is_active"
                className="col-md-12"
                value={subscriber.is_active === 1 ? '1' : '0'}
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

        <Link to={"/admin/subscriber"} className="btn btn-danger">
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
    this.state = {errors:[], showError:false};
    this.sendError = this.sendError.bind(this);
  }

  sendError(err, errors=[]) {
    if(Object.keys(err).length){
      for (let index in Object.keys(err)) {
        let innerErr = Object.keys(err)[index];
        if(Array.isArray(err[innerErr])) {
          for (let i in err[innerErr]) {
            errors.push(innerErr.charAt(0).toUpperCase() + innerErr.slice(1)+' : '+err[innerErr][i]);
          }
        } else {
          return this.sendError(err[innerErr], errors);
        }
      }
      this.setState({showError:true});
    }

    this.setState({errors:errors});
  }


  render() {
    return (
      <>
        <Notice icon="flaticon-warning kt-font-primary" style={{display: this.state.showError ? 'flex' : 'none' }}>
        { 
          this.state.errors.map((val, i) => {
              return <li key={i}>{val}</li>
          })
        }
        </Notice>

        <div className="row">
          <div className="col-md-12">
            <CustomHead
              beforeCodeTitle="Subscriber"
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/admin/subscriber"} className="btn btn-clean btn-icon-sm">
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