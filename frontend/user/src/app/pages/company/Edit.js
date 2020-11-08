import React from "react";
import Notice from "../../partials/content/Notice";
import CustomHead from "../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import { list, patch, USER_URL } from "../../crud/api";

class Edit extends React.Component {
  constructor(props) {
    super(props);

    const company_id = this.props.data.userProp.contact.company.id;
    
    console.log('edit', company_id)
    this.state = { 
      validated: false, 
      company:{},
    };

    this.getCompany(company_id);
    
  }

  getCompany(company_id) {
    list('companies/'+company_id+'/').then(
      (response) => {
        delete response.data.city;
        delete response.data.state;
        delete response.data.country;
        delete response.data.specialities;
        this.setState({company : response.data});
      });  
  }

  handleChange(event) {
    var company = this.state.company;
    var attr = event.target.name;
    var val = event.target.value;
    company[attr] = val;
    this.setState({company : company})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    patch('companies/'+this.state.company.id+'/', this.state.company).then(
      (response) => {
        this.setState({company : response.data});
        this.props.data.history.push("/"+USER_URL+"/dashboard");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }
  render() {
    const { company } = this.state;
    return (
      <Form
        noValidate
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="4">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              disabled
              type="text"
              placeholder=""
              model="company"
              name="name"
              value = {company? company.name:''}
              // onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>RFQ Email</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              model="company"
              name="rfq_email"
              value = {company? company.rfq_email:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group><Form.Group as={Col} md="4">
            <Form.Label>AOG Email</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              model="company"
              name="aog_email"
              value = {company? company.aog_email:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
        </Form.Row>
      <Button type="submit" className="btn btn-primary">
          <i className="la la-save" />
          Update & Close
        </Button>
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
              beforeCodeTitle={'My Company'}
              jsCode =   {<div className="kt-portlet__head-toolbar">
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