import React from "react";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Modal, Form} from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, MEDIA_URL} from "../../../crud/api";
import {Paper, Grid} from "@material-ui/core";
import Notice from "../../../partials/content/Notice";

class Detail extends React.Component {

  constructor(props) {
    super(props);
    const { country_id, type } = this.props.data.match.params
    const divStyle = {
      padding : '15px'
    };
    this.txt_weight = {fontWeight:500}
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      type : type,
      country:{},
      action:'',
      showModal: false,
      created_at: '',
      updated_at: '',
      image:null,
      is_active: ''

    };
    this.getCountry(country_id);
    this.divStyle = divStyle;
  }

  getCountry(country_id) {
    list('countries/'+country_id+'/').then(
      (response) => {
          delete response.data.type;
          let selected_continent = response.data.continent.name;
          let selected_region =  response.data.region.name
          response.data.continent = response.data.continent.id;
          response.data.region = response.data.region.id;
          this.setState({
              created_at : new Intl.DateTimeFormat().format(new Date(response.data.created_at)),
              updated_at : new Intl.DateTimeFormat().format(new Date(response.data.updated_at)),
              image: response.data.media ? response.data.media.original_file_name : null,
              selected_continent:selected_continent, country : response.data, selected_region:selected_region,
          });
          this.props.setTitle(response.data.name);
    });
  }

  handleChange(val, attr) {
    var country = this.state.country;

    country[attr] = val;
    this.setState({country : country})
    patch('countries/'+this.state.country.id+'/', this.state.country).then(
      (response) => {
        this.setState({country : response.data});
    }).catch(error => {
        this.props.sendError(error.response.data);
    });
  }
  handleModalShow(event, action) {
    var val = event.target.value;
    if (action === 'status'){
      val = parseInt(val);
      this.setState({is_active : val === 1 ? 0:1})
    }
    this.setState({action: action});
    this.setState({ showModal: true });
  }

  handleModalClose() {
   this.setState({ showModal: false });
  }

  confirm() {
    if(this.state.action === 'status') {
      this.state.country.is_active = this.state.is_active;
      patch('countries/'+this.state.country.id+'/', this.state.country).then(
        (response) => {
          delete response.data.type;
          this.setState({country : response.data});
          this.setState({showModal : false});
      }).catch(error => {
          this.props.sendError(error.response.data);
          this.setState({showModal : false});
      });
    }
  }



  render() {
    const { validated, country, selected_continent, selected_region } = this.state;
    return (
        <div>
          <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                  <Form>
                  <Form.Group>
                    <Form.Label>Name</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{country.name}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Continent</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{selected_continent}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Region</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{selected_region}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Currency</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{country.currency}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>ISO 3116 Alpha-2 Code</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{country.iso_3116_alpha_2}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Dialing Code</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{country.dialing_code}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Date Created</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{this.state.created_at}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Date Modified</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{this.state.updated_at}</Form.Label>
                  </Form.Group>
                    <Form.Group>
                      <Form.Label>Status</Form.Label><br/>
                      <span onClick={(e) => this.handleModalShow(e,'status')} className={this.state.country.is_active === 1 ? 'kt-switch kt-switch--sm kt-switch--success':'kt-switch kt-switch--sm kt-switch--danger'}>
                        <label>
                          <input
                            type="checkbox" checked={country.is_active === 1 ? 'defaultChecked':''}
                            value={country.is_active === 1 ? '1' : '0'}
                            name="is_active"
                          />
                          <span />
                        </label>
                      </span>
                    </Form.Group>
                  </Form>
                </Grid>
                <Grid item xs={12} md={3}>
                    <img style={{maxHeight:'220px', maxWidth:'200px'}} src={ this.state.image ? MEDIA_URL+this.state.image : MEDIA_URL+'dummy_image.svg' } />
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
    this.state = {errors:{}, showError:false, title: 'Country'};
    this.sendError = this.sendError.bind(this);
  }

  sendError(error) {
    if(Object.keys(error).length)
      this.setState({showError:true});

    this.setState({errors:error});
  }

  setMainTitle = (value) => {
    this.setState({title: value});
  };

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
              beforeCodeTitle={this.state.title}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/admin/countries"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                      <Link to={"/admin/countries/"+this.props.match.params.country_id+"/edit"} className="btn btn-primary">
                        <i className="la la-edit" />
                        Edit
                      </Link>
                  </div>
                </div>
              </div>
            </div> }
            >
              <div className="kt-section">
                <Detail data={this.props} sendError={this.sendError} setTitle={this.setMainTitle} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(DetailPage);