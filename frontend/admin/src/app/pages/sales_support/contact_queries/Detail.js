import React from "react";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Modal, Form, Col} from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, MEDIA_URL} from "../../../crud/api";
import {Paper, Grid} from "@material-ui/core";
import EasyEdit from 'react-easy-edit';
import Notice from "../../../partials/content/Notice";



class Detail extends React.Component {

  constructor(props) {
    super(props);
    const { query_id, type } = this.props.data.match.params
    const divStyle = {
      padding : '15px'
    };
    this.txt_weight = {fontWeight:500}
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      type : type,
      query:{},
      action:'',
      showModal: false,
      created_at: '',
      updated_at: '',
      image:null,
      is_published: ''

    };
    this.getQuery(query_id);
    this.divStyle = divStyle;
  }

  getQuery(query_id) {
    list('contactqueries/'+query_id+'/').then(
      (response) => {
          delete response.data.type;
          this.setState({
              created_at : new Intl.DateTimeFormat().format(new Date(response.data.created_at)),
              updated_at : new Intl.DateTimeFormat().format(new Date(response.data.updated_at)),
              image: response.data.media ? response.data.media.original_file_name : null
          });
          this.props.setTitle(response.data.name);
          this.setState({query : response.data})
    });
  }

  handleChange(val, attr) {
    var query = this.state.query;

    query[attr] = val;
    this.setState({query : query})
    patch('contactqueries/'+this.state.query.id+'/', this.state.query).then(
      (response) => {
        this.setState({query : response.data});
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
      this.state.query.is_published = this.state.is_published;
      patch('contactqueries/'+this.state.query.id+'/', {is_published: this.state.is_published}).then(
        (response) => {
          delete response.data.type;
          this.setState({query : response.data});
          this.setState({showModal : false});
      }).catch(error => {
          this.props.sendError(error.response.data);
          this.setState({showModal : false});
      });
    }
  }



  render() {
    const { validated, query } = this.state;
    return (
        <div>
          <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                  <Form>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Name</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{query.name}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Email</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{query.email}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Phone</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{query.phone}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Country</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{query.country ? query.country.name :''}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Enquiry Type</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{query.enquiry_type}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Status</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{query.status}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Message</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{query.message}</Form.Label>
                    </Form.Group>
                    
                  </Form.Row>
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
    this.state = {errors:{}, showError:false, title: 'Enquery'};
    this.state.type = type;
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
                  <Link to={"/admin/contactqueries"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                    
                      <Link to={"/admin/contactqueries/"+this.props.match.params.query_id+"/edit"} className="btn btn-primary">
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