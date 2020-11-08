import React from "react";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Modal, Form, Col} from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, MEDIA_URL} from "../../../crud/api";
import {Paper, Grid} from "@material-ui/core";
import EasyEdit from 'react-easy-edit';
import Notice from "../../../partials/content/Notice";
import Carousel from 'react-bootstrap/Carousel'



class Detail extends React.Component {

  constructor(props) {
    super(props);
    const { aircraft_id, type } = this.props.data.match.params
    const divStyle = {
      padding : '15px'
    };
    this.txt_weight = {fontWeight:500}
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      type : type,
      aircraft:{},
      action:'',
      showModal: false,
      created_at: '',
      updated_at: '',
      image:null,
      is_published: ''

    };
    this.getAircraft(aircraft_id);
    this.divStyle = divStyle;
  }

  getAircraft(aircraft_id) {
    list('aircrafts/'+aircraft_id+'/').then(
      (response) => {
          // delete response.data.type;
          this.setState({
              created_at : new Intl.DateTimeFormat().format(new Date(response.data.created_at)),
              updated_at : new Intl.DateTimeFormat().format(new Date(response.data.updated_at)),
              image: response.data.media ? response.data.media : null
          });
          this.setState({aircraft : response.data})
    });
  }

  handleChange(val, attr) {
    var aircraft = this.state.aircraft;

    aircraft[attr] = val;
    this.setState({aircraft : aircraft})
    patch('aircrafts/'+this.state.aircraft.id+'/', this.state.aircraft).then(
      (response) => {
        this.setState({aircraft : response.data});
    }).catch(error => {
        this.props.sendError(error.response.data);
    });
  }

  handleModalShow(event, action) {
    var val = event.target.value;
    if (action === 'status'){
      val = parseInt(val);
      this.setState({is_published : val === 1 ? 0:1})
    }
    this.setState({action: action});
    this.setState({ showModal: true });
  }

  handleModalClose() {
   this.setState({ showModal: false });
  }

  confirm() {
    if(this.state.action === 'status') {
      this.state.aircraft.is_published = this.state.is_published;
      patch('aircrafts/'+this.state.aircraft.id+'/', {is_published: this.state.is_published}).then(
        (response) => {
          delete response.data.type;
          this.setState({aircraft : response.data});
          this.setState({showModal : false});
      }).catch(error => {
          this.props.sendError(error.response.data);
          this.setState({showModal : false});
      });
    }
  }

  render() {
    const { validated, aircraft } = this.state;    
    return (
        <div>
          <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                  <Form>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>User</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.user ? (aircraft.user.contact ? aircraft.user.contact.first_name+' '+aircraft.user.contact.last_name : aircraft.user.email) : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Category</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.category ? aircraft.category.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Manufacturer</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.manufacturer ? aircraft.manufacturer.name: ''}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Type</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.type ? aircraft.type.name: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Model</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.model ? aircraft.model.name : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <hr/>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>MSN</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.msn ? aircraft.msn : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>YOM</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.yom ? aircraft.yom: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Configuration</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.configuration ? aircraft.configuration.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Seating</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>Economy (Y) {aircraft.seating_economy ? aircraft.seating_economy: 0}, Business (C) {aircraft.seating_business ? aircraft.seating_business: 0}, First (F) {aircraft.seating_first_class ? aircraft.seating_first_class: 0}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Current Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.status ? aircraft.status :'-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Compliance</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.compliance ? aircraft.compliance: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>TSN</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.tsn ? aircraft.tsn: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>CSN</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.csn ? aircraft.csn: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>MTOW Kg</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.mtow ? aircraft.mtow: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>MLGW Kg</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.mlgw ? aircraft.mlgw: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Last C Check</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.last_c_check ? aircraft.last_c_check: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Registration Number</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.registration_number ? aircraft.registration_number: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Registration Country</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.registration_country ? aircraft.registration_country.name: '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <hr/>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Engine Manufacturer</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.engine_manufacturer ? aircraft.engine_manufacturer.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Engine Type</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.engine_type ? aircraft.engine_type.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Engine Model</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.engine_model ? aircraft.engine_model.name : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <hr/>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Offer For</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.offer_for ? aircraft.offer_for : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Price</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.price ? aircraft.price : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Availability</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.availability ? aircraft.availability: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Current Location</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.current_location ? aircraft.current_location.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Primary Contact</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.primary_contact ? aircraft.primary_contact.first_name+' '+aircraft.primary_contact.last_name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Owner</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.owner ? aircraft.owner.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Seller</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.seller ? aircraft.seller.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Manager</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.manager ? aircraft.manager.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Previous Operator</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.previous_operator ? aircraft.previous_operator.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Current Operator</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.current_operator ? aircraft.current_operator.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} xs="12">
                      <Form.Label>Additional details</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.description ? aircraft.description : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <hr/>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Views</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.views ? aircraft.views : 0}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Likes</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.likes ? aircraft.likes : 0}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Promote Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.is_featured ? 'Yes' : 'No'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Active Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.isactivestatus ? aircraft.isactivestatus : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Published Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{aircraft.is_published ?  'Yes' : 'No'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Date Created</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{this.state.created_at ? this.state.created_at : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Date Modified</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{this.state.updated_at ? this.state.updated_at : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  </Form>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Carousel>
                    { this.state.image && this.state.image.map((image, index) => {
                        return <Carousel.Item key={index}>
                                <img
                                  className="d-block w-100"
                                  src={  MEDIA_URL+image.original_file_name }
                                  alt="First slide"
                                />
                              </Carousel.Item>
                        })
                    }
                  </Carousel> 
                </Grid>
            </Grid>

            <Modal show={this.state.showModal} onHide={this.handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button variant="danger" onClick={this.confirm}>
                  Yes
                </Button>
                <Button variant="success" onClick={this.handleModalClose}>
                  No
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
    );
  }
}

class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    let type = props.match.params.type;
    this.state = {errors:{}, showError:false};
    this.state.type = type;
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
              beforeCodeTitle={"Aircraft"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/admin/aircraft/asset"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>

                      <Link to={"/admin/aircraft/asset/"+this.props.match.params.aircraft_id+"/edit"} className="btn btn-primary">
                        <i className="la la-edit" />
                        Edit
                      </Link>
                  </div>
                </div>
              </div>
            </div> }
            >
              <div className="kt-section">
                <Detail data={this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(DetailPage);