import React from "react";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Modal, Form, Col} from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, MEDIA_URL} from "../../../crud/api";
import {Paper, Grid} from "@material-ui/core";
import EasyEdit from 'react-easy-edit';
import Notice from "../../../partials/content/Notice";
import Carousel from 'react-bootstrap/Carousel';

class Detail extends React.Component {

  constructor(props) {
    super(props);
    const { apu_id, type } = this.props.data.match.params
    const divStyle = {
      padding : '15px'
    };
    this.txt_weight = {fontWeight:500}
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      type : type,
      apu:{},
      action:'',
      showModal: false,
      created_at: '',
      updated_at: '',
      image:null,
      is_published: ''

    };
    this.getApu(apu_id);
    this.divStyle = divStyle;
  }

  getApu(apu_id) {
    list('apus/'+apu_id+'/').then(
      (response) => {
          // delete response.data.type;
          this.setState({
              created_at : new Intl.DateTimeFormat().format(new Date(response.data.created_at)),
              updated_at : new Intl.DateTimeFormat().format(new Date(response.data.updated_at)),
              image: response.data.media ? response.data.media : null
          });
          this.setState({apu : response.data})
    });
  }

  handleChange(val, attr) {
    var apu = this.state.apu;

    apu[attr] = val;
    this.setState({apu : apu})
    patch('apus/'+this.state.apu.id+'/', this.state.apu).then(
      (response) => {
        this.setState({apu : response.data});
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
      this.state.apu.is_published = this.state.is_published;
      patch('apus/'+this.state.apu.id+'/', {is_published: this.state.is_published}).then(
        (response) => {
          delete response.data.type;
          this.setState({apu : response.data});
          this.setState({showModal : false});
      }).catch(error => {
          this.props.sendError(error.response.data);
          this.setState({showModal : false});
      });
    }
  }



  render() {
    const { validated, apu } = this.state;
    return (
        <div>
          <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                  <Form>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>User</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.user ? (apu.user.contact ? apu.user.contact.first_name+' '+apu.user.contact.last_name : apu.user.email) : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Category</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.category ? apu.category.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Manfacturer</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.manufacturer ? apu.manufacturer.name: ''}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Type</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.type ? apu.type.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Model</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.model ? apu.model.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Serial Number</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.serial_number ? apu.serial_number : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Part Number</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.part_number ? apu.part_number : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Cycles Remaining (CR)</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.cycle_remaining ? apu.cycle_remaining : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Current Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.status ? apu.status :'-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Thrust Rating</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.thrust_rating ? apu.thrust_rating :'-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>LSV Description</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.lsv_description ? apu.lsv_description :'-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Offer For</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.offer_for ? apu.offer_for : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Availablility</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.availability ? apu.availability : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Current Location</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.current_location ? apu.current_location.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Primary Contact</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.primary_contact ? apu.primary_contact.first_name+' '+apu.primary_contact.last_name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Owner</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.owner ? apu.owner.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Seller</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.seller ? apu.seller.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} xs="12">
                      <Form.Label>Additional details</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.description ? apu.description : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <hr/>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Views</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.views ? apu.views : 0}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Likes</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.likes ? apu.likes : 0}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Promote Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.is_featured ? 'Yes' : 'No'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Active Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.isactivestatus ? apu.isactivestatus : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Published Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{apu.is_published ? apu.is_published : '-----'}</Form.Label>
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
              beforeCodeTitle={"Apu"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/admin/apu/asset"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                    <Link to={"/admin/apu/asset/"+this.props.match.params.apu_id+"/edit"} className="btn btn-primary">
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