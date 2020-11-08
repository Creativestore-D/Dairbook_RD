import React from "react";
import CustomHead from "../../partials/content/CustomHeader.js";
import {Button, Modal, Form} from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, MEDIA_URL} from "../../crud/api";
import {Paper, Grid} from "@material-ui/core";
import Notice from "../../partials/content/Notice";



class Detail extends React.Component {

  constructor(props) {
    super(props);
    const { company_id, type } = this.props.data.match.params
    const divStyle = {
      padding : '15px'
    };
    this.txt_weight = {fontWeight:500}
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      type : type,
      company:{id:company_id},
      action:'',
      showModal: false,
      created_at: '',
      updated_at: '',
      image:null,
      is_active: ''

    };
    this.getCompany(company_id);
    this.divStyle = divStyle;
  }

  getCompany(company_id) {
    list('companies/'+company_id+'/').then(
      (response) => {
        delete response.data.type;
          let selected_specialities =[];
          let specialities_ids = [];
          for (let i in response.data.specialities) {
              selected_specialities.push(response.data.specialities[i].name+', ');
              specialities_ids.push(response.data.specialities[i].id);
          } 
          response.data.specialities = specialities_ids;
          let city = response.data.city.name;
          this.setState({
            created_at : new Intl.DateTimeFormat().format(new Date(response.data.created_at)),
            updated_at : new Intl.DateTimeFormat().format(new Date(response.data.updated_at)),
            image: response.data.media ? response.data.media.original_file_name : null,
            company : response.data, selected_specialities:selected_specialities, city:city});
      });
        
  }

  handleChange(val, attr) {
    var company = this.state.company;

    company[attr] = val;
    this.setState({company : company})
    patch('companies/'+this.state.company.id+'/', this.state.company).then(
      (response) => {
        this.setState({company : response.data});
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
      this.state.company.is_active = this.state.is_active;
      delete this.state.company.city;
      delete this.state.company.country;
      delete this.state.company.state;
      delete this.state.company.specialities;
      patch('companies/'+this.state.company.id+'/', this.state.company).then(
        (response) => {
          this.setState({company : response.data});
          this.setState({showModal : false});
      }).catch(error => {
          this.props.sendError(error.response.data);
          this.setState({showModal : false});
      });
    }
  }



  render() {
    const { validated, company, selected_specialities, city} = this.state;
    return (
        <div>
          <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                  <div className="kt_section__detail">
                    <div className="row mb-3">
                      <div className="col-md-6 col-12">
                          <div className="kt_detail__item_title">Name</div>
                          <div>{company.name ? company.name : <i>(not provided)</i>}</div>
                      </div>

                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">Address</div>
                        <div>{company.address ? company.address : <i>(not provided)</i>}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">Business Number</div>
                        <div>{company.business_phone ? company.business_phone : <i>(not provided)</i>}</div>
                      </div>

                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">Country</div>
                        <div>{(company.country && company.country.name !== '') ? company.country.name : <i>(not provided)</i>}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">Website</div>
                        <div>{company.website ? company.website : <i>(not provided)</i>}</div>
                      </div>

                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">State</div>
                        <div>{(company.state && company.state.name !== '') ? company.state.name : <i>(not provided)</i>}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">RFQ Email</div>
                        <div>{company.rfq_email ? company.rfq_email : <i>(not provided)</i>}</div>
                      </div>

                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">City</div>
                        <div>{city ? city : <i>(not provided)</i>}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">AOG Email</div>
                        <div>{company.aog_email ? company.aog_email : <i>(not provided)</i>}</div>
                      </div>

                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">P.O.Box</div>
                        <div>{company.po_box ? company.po_box : <i>(not provided)</i>}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">Zipcode/Postal Code</div>
                        <div>{company.zip_code ? company.zip_code : <i>(not provided)</i>}</div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">Date Created</div>
                        <div>{this.state.created_at}</div>
                      </div>

                      <div className="col-md-6 col-12">
                        <div className="kt_detail__item_title">Date Modified</div>
                        <div>{this.state.updated_at}</div>
                      </div>
                    </div>

                    <div className="kt-separator kt-separator--space-lg kt-separator--border-dashed"></div>

                    <div className="row mb-3">
                      <div className="col-12">
                        <div className="kt_detail__item_title">Profile</div>
                        <div>{company.profile ? company.profile : ' --- '}</div>
                      </div>
                    </div>

                  </div>
                  <Form>
                    <Form.Group>
                      <Form.Label>Status:</Form.Label><br/>
                      <span onClick={(e) => this.handleModalShow(e,'status')} className={this.state.company.is_active === 1 ? 'kt-switch kt-switch--sm kt-switch--success':'kt-switch kt-switch--sm kt-switch--danger'}>
                        <label>
                          <input
                            type="checkbox" checked={company.is_active === 1 ? 'defaultChecked':''}
                            value={company.is_active === 1 ? '1' : '0'}
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
              beforeCodeTitle={"Company"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/admin/companies"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                      <Link to={"/admin/companies/"+this.props.match.company_id+"/edit"} className="btn btn-primary">
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