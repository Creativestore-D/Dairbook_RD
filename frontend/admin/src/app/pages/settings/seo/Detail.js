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
    const { seo_id, type } = this.props.data.match.params
    const divStyle = {
      padding : '15px'
    };
    this.txt_weight = {fontWeight:500}
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      type : type,
      seos:{id:seo_id},
      action:'',
      showModal: false,
      created_at: '',
      updated_at: '',
      image:null,
      is_active: ''

    };
    this.getSeo(seo_id);
    this.divStyle = divStyle;
  }

  getSeo(seo_id) {
    list('seos/'+seo_id+'/').then(
      (response) => {
          this.setState({created_at : new Intl.DateTimeFormat().format(new Date(response.data.created_at)),
            updated_at : new Intl.DateTimeFormat().format(new Date(response.data.updated_at)),
            image: response.data.media ? response.data.media.original_file_name : null,
            seos : response.data, 
          });
            this.props.setTitle(response.data.model_type);
    });
         
  }

  handleChange(val, attr) {
    var seos = this.state.seos;

    seos[attr] = val;
    this.setState({seos : seos})
    patch('seos/'+this.state.seos.id+'/', this.state.seos).then(
      (response) => {
        this.setState({seos : response.data});
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
      this.state.seos.is_active = this.state.is_active;
      patch('seos/'+this.state.seos.id+'/', this.state.seos).then(
        (response) => {
          delete response.data.type;
          this.setState({seos : response.data});
          this.setState({showModal : false});
      }).catch(error => {
          this.props.sendError(error.response.data);
          this.setState({showModal : false});
      });
    }
  }



  render() {
    const { seos} = this.state;
    return (
        <div>
          <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                  <Form>
                  <Form.Group>
                    <Form.Label>Page</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{seos.model_type}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Title</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{seos.title}</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label><br/>
                    <Form.Label style={this.txt_weight}>{seos.description}</Form.Label>
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
    this.state = {errors:{}, showError:false, title: 'Seo'};
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
                  <Link to={"/admin/seos"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                    <Link to={"/admin/seos/"+this.props.match.params.seo_id+"/edit"} className="btn btn-primary">
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