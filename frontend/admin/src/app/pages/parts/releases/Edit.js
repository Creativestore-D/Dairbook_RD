import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl, Button as ButtonCore,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import { list, patch } from "../../../crud/api";



class Edit extends React.Component {
  constructor(props) {
    super(props);

    const { release_id } = this.props.data.match.params
    this.state = { 
      validated: false, 
      release:{},
    };

    this.getRelease(release_id);
  }

  getRelease(release_id) {
    list('releases/'+release_id+'/').then(
      (response) => {
          this.setState({release : response.data})
    });
  }

  handleChange(event) {
    var release = this.state.release;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    release[attr] = val;
    this.setState({release : release})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    patch('releases/'+this.state.release.id+'/', this.state.release).then(
      (response) => {
        this.setState({release : response.data});
        this.props.data.history.push("/admin/parts/release");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  render() {
    const { validated, release} = this.state;
    return (
      <Form
        noValidate
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="12">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="release"
              name="name"
              defaultValue={release ? release.name:''}
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
                value={release.is_active === 1 ? '1' : '0'}
                onChange={e => this.handleChange(e)}
              >
                <FormControlLabel className="col-md-2" value="1" control={<Radio />} label="Publish" />
                <FormControlLabel className="col-md-2" value="0" control={<Radio />} label="Inactive" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
        </Form.Row>
        <Button type="submit" className="btn btn-primary">
          <i className="la la-save" />
          Update
        </Button>
        &nbsp;&nbsp;

        <Link to={"/admin/parts/release"} className="btn btn-danger">
          <i className="la la-remove" />
          Cancel
        </Link>
      </Form>
    );
  }
}

class EditPage extends React.Component {
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
    
    // const { Formik } = formik;
    const buttons = <Link to={"/admin/parts/release"} className="btn btn-clean btn-icon-sm">
                      <i className="la la-long-arrow-left"></i>
                      Back
                    </Link>
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
              beforeCodeTitle={'Parts Releases'}
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
                <Edit data = {this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(EditPage);