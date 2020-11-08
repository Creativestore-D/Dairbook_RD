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

    const { speciality_id } = this.props.data.match.params
    this.state = { 
      validated: false, 
      speciality:{},
    };

    this.getSpeciality(speciality_id);
  }

  getSpeciality(speciality_id) {
    list('speciality/'+speciality_id+'/').then(
      (response) => {
          this.setState({speciality : response.data})
    });
  }

  handleChange(event) {
    var speciality = this.state.speciality;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    speciality[attr] = val;
    this.setState({speciality : speciality})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    patch('speciality/'+this.state.speciality.id+'/', this.state.speciality).then(
      (response) => {
        this.setState({speciality : response.data});
        this.props.data.history.push("/admin/speciality");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  render() {
    const { validated, speciality} = this.state;
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
              model="specialities"
              name="name"
              defaultValue={speciality ? speciality.name:''}
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
                value={speciality.is_active === 1 ? '1' : '0'}
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

        <Link to={"/admin/speciality"} className="btn btn-danger">
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
    const buttons = <Link to={"/admin/speciality"} className="btn btn-clean btn-icon-sm">
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
              beforeCodeTitle={'Company Speciality'}
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