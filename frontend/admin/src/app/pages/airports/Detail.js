import React from "react";
import CustomHead from "../../partials/content/CustomHeader.js";
import {Button, Modal, Form} from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, MEDIA_URL} from "../../crud/api";
import {Paper, Grid} from "@material-ui/core";
import EasyEdit from 'react-easy-edit';
import Notice from "../../partials/content/Notice";



class Detail extends React.Component {

  constructor(props) {
    super(props);
    const { airport_id } = this.props.data.match.params
    const divStyle = {
      padding : '15px'
    };
    this.txt_weight = {fontWeight:500}
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      airport:{},
      action:'',
      showModal: false,
      created_at: '',
      updated_at: '',
      is_active: ''
    };
    this.getAirport(airport_id);
    this.divStyle = divStyle;
  }

  getAirport(airport_id) {
    list('airport/'+airport_id+'/').then(
      (response) => {
          /*this.setState({
              created_at : new Intl.DateTimeFormat().format(new Date(response.data.created_at)),
              updated_at : new Intl.DateTimeFormat().format(new Date(response.data.updated_at)),
              image: response.data.media ? response.data.media.original_file_name : null
          });*/
          this.props.setTitle(response.data.name);
          this.setState({airport : response.data})
    });
  }

  handleChange(val, attr) {
    var airport = this.state.airport;

    airport[attr] = val;
    this.setState({airport : airport})
    patch('airport/'+this.state.airport.id+'/', this.state.airport).then(
      (response) => {
        this.setState({airport : response.data});
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
      this.state.airport.is_active = this.state.is_active;

      delete this.state.airport.user;
      delete this.state.airport.city;
      delete this.state.airport.country;
      delete this.state.airport.state;
      delete this.state.airport.airfield_type;

      patch('airport/'+this.state.airport.id+'/', this.state.airport).then(
        (response) => {
          this.setState({airport : response.data});
          this.setState({showModal : false});
      }).catch(error => {
          this.props.sendError(error.response.data);
          this.setState({showModal : false});
      });
    }
  }



  render() {
    const { validated, airport } = this.state;
    return (
        <div>
          <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Form>
                  <Form.Group>
                    <Form.Label>Name</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.name}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Airfield Type</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.airfield_type ? airport.airfield_type.name : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>City</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.city ? airport.city.name : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>State</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.state ? airport.state.name : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Country</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.country ? airport.country.name : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Sunrise</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.sunrise ? airport.sunrise : ''}</Form.Label>
                  </Form.Group>
                    <Form.Group>
                      <Form.Label>Status</Form.Label><br/>
                      <span onClick={(e) => this.handleModalShow(e,'status')} className={this.state.airport.is_active === 1 ? 'kt-switch kt-switch--sm kt-switch--success':'kt-switch kt-switch--sm kt-switch--danger'}>
                        <label>
                          <input
                            type="checkbox" checked={airport.is_active === 1 ? 'defaultChecked':''}
                            value={airport.is_active === 1 ? '1' : '0'}
                            name="is_active"
                          />
                          <span />
                        </label>
                      </span>
                    </Form.Group>
                  </Form>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Form>
                  <Form.Group>
                    <Form.Label>IATA Code</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.iata_code ? airport.iata_code : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>ICAO Code</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.icao_code ? airport.icao_code : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Latitude</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.latitude ? airport.latitude : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Longitude</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.longitude ? airport.longitude : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Timezone</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.time_zone ?  'GMT ' + airport.time_zone : ''}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Sunset</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{airport.sunset ? airport.sunset : ''}</Form.Label>
                  </Form.Group>
                  </Form>
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
    this.state = {errors:{}, showError:false, title: 'Airport'};
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
                  <Link to={"/admin/airport"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                      <Link to={"/admin/airport/"+this.props.match.params.airport_id+"/edit"} className="btn btn-primary">
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