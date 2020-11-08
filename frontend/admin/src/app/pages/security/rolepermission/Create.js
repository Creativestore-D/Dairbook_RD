import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import { list, post, PERMISSIONS } from "../../../crud/api";
import Select from 'react-select';



class Create extends React.Component {

  constructor(props) {
    super(props);

    const { user_id } = this.props.data.match.params
    this.state = { 
      validated: false, 
      role:{}, 
      action:'',
    };
  }

  handleChange(event) {
    var role = this.state.role;
    var attr = event.target.name;
    var val = event.target.value;

    role[attr] = val;
    this.setState({role : role})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    post('groups', this.state.role).then(
      (response) => {
        this.setState({role : response.data});
        this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm("role-permission-form"):"/admin/role-permission");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }
  clearForm = (id) => { 
      document.getElementById(id).reset();
      this.setState({selectedFile: null, previewFile: null});
    }
  render() {
    const { validated, user } = this.state;
    return (
      <Form
        noValidate
        id = "role-permission-form"
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="4">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              required
              type="text"
              model="contact"
              name="name"
              onChange={e => this.handleChange(e)}
            />
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

        <Link to="/admin/role-permission" className="btn btn-danger">
          <i className="la la-remove" />
          Cancel
        </Link>
      </Form>
    );
  }
}

// const { Formik } = formik;
const buttons = <Link to="/admin/role-permission" className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>

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
              beforeCodeTitle="Add Role"
              jsCode =   {<div className="kt-portlet__head-toolbar">
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