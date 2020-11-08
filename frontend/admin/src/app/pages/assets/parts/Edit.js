import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col, Tab, Tabs} from "react-bootstrap";
import {
  Checkbox,
  FormControlLabel,FormGroup,
  FormControl, Button as ButtonCore,
} from "@material-ui/core";
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, MEDIA_URL, ENGINE_STATUSES, ENGINE_OFFER, UNIT_MEASURES, post} from "../../../crud/api";
import Select from 'react-select';


class Create extends React.Component {

  constructor(props) {
   super(props);
   const { part_id, type } = this.props.data.match.params

   this.state = { 
      validated: false, 
      part:{}, 
      selectedFile: null,
      countries:[],
      contacts:[],
      companies:[],
      users:[],
      conditions:[],
      releases:[],
      selected_primary_contact:{value:''},
      selected_location:{value:''},
      selected_owner:{value:''},
      selected_seller:{value:''},
      selected_user:{value:''},
      selected_release:{value:''},
      selected_unit_measure:{value:''},
      selected_condition:{value:''}
    };
    this.getPart(part_id);
  }

  getPart(part_id) {
    list('parts/'+part_id+'/').then(
      (response) => {
          this.setState({part : response.data})
          // this.getDropdownsListing();
        this.loadModels();
    });
  }

  loadModels() {
        let part_data = this.state.part;

        // static dropdowns calculation here -

        let static_dropdowns = { // when you have static dropdown like gender just put here
          unit_measure: UNIT_MEASURES
        }

        let dropdown_keys = Object.keys(static_dropdowns);
        for(let key in dropdown_keys) {
          for(let index in static_dropdowns[dropdown_keys[key]]) {
            if(static_dropdowns[dropdown_keys[key]][index].value === part_data[dropdown_keys[key]]){
              this.setState({['selected_'+dropdown_keys[key]]:static_dropdowns[dropdown_keys[key]][index]});
              break;
            }
          }
        }

        let models = {
          'AbUsers':{},
          'AbContacts':{},
          'AbConditions':{},
          'AbReleases':{},
          'AbCountries':{},
          'AbCompanies':{},
        }

        // lets do some mapping to avoid if else conditions
        let state_endpoints = {
          AbUsers:['user'],
          AbContacts:['primary_contact'],
          AbCountries:['location'],
          AbReleases:['release'],
          AbConditions:['condition'],
          AbCompanies:['owner', 'seller']
        }

        post('abmodels', {models:models}).then(function(response){
          let newStates = {};
          for(let opt in response.data){

            response.data[opt].map((row, i) => {
              if(opt === 'AbContacts' || opt === 'AbUsers')
                  row.name = row.first_name+' '+row.last_name;
              if(opt === 'AbUsers')
                  row.id = row.user_id;

              response.data[opt][i].label = row.name;
              response.data[opt][i].value = row.id;

              Object.keys(state_endpoints).map((key, i) => {
                state_endpoints[key].map((state, index) => {
                  if(opt === key && part_data[state] !== null && part_data[state].id !== undefined && part_data[state].id === row.id)
                    newStates['selected_'+state] = row;
                })
              })

            })
          }
          newStates['users'] = response.data.AbUsers;
          newStates['contacts'] = response.data.AbContacts;
          newStates['countries'] = response.data.AbCountries;
          newStates['conditions'] = response.data.AbConditions;
          newStates['releases'] = response.data.AbReleases;
          newStates['companies'] = response.data.AbCompanies;

          this.setState(newStates);
        }.bind(this))
  }

  handleChange(event) {
    var part = this.state.part;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    part[attr] = val;
    this.setState({part : part})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    this.checkDataFormat(); // this is done to convert foregin table objects into pk
    if(!this.state.selectedFile)
      delete this.state.part.file;
    patch('parts/'+this.state.part.id+'/', this.state.part).then(
      (response) => {
        this.setState({part : response.data});
        this.props.data.history.push(this.state.action == 'save_new' ? "/admin/part/asset/create":"/admin/part/asset");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  getDropdownsListing() {
    let part_data = this.state.part;
    let dropdowns = {// when you have database dropdown like departments just put here
      // dbcolumn: api_endpoint
      primary_contact:'contacts',
      location: 'countries',
      owner:'companies',
      user:'users',
      condition:'conditions',
      release:'releases'
    }

    let duplicating_dropdowns = {
      companies: ['seller'],
    }

    // static dropdowns calculation here - 
    let static_dropdowns = { // when you have static dropdown like gender just put here
      // dbcolumn: imported name
      unit_measure: UNIT_MEASURES
    }
    let dropdown_keys = Object.keys(static_dropdowns);
    for(let key in dropdown_keys) {
      for(let index in static_dropdowns[dropdown_keys[key]]) {
        if(static_dropdowns[dropdown_keys[key]][index].value === part_data[dropdown_keys[key]]){
          this.setState({['selected_'+dropdown_keys[key]]:static_dropdowns[dropdown_keys[key]][index]});
          break;
        }
      }
    }

    dropdown_keys = Object.keys(dropdowns);
    for(let key in dropdown_keys) {
      let params = {records:'all', is_active:1}
        list(dropdowns[dropdown_keys[key]], params).then(function(response){
            let data = response.data;
            let selected = {};
            for(let opt in data){
              // special case for contacts 
              if(dropdowns[dropdown_keys[key]] === 'contacts')
                data[opt].name = data[opt].first_name+' '+data[opt].last_name;
              else if(dropdowns[dropdown_keys[key]] === 'users')
                data[opt].name = data[opt].contact.first_name+' '+data[opt].contact.last_name;

              data[opt].label = data[opt].name;    
              data[opt].value = data[opt].id;   

              if(part_data[dropdown_keys[key]] != undefined && data[opt].id === part_data[dropdown_keys[key]].id)
                selected = data[opt]

              if(duplicating_dropdowns[dropdowns[dropdown_keys[key]]] != undefined) {
                for(let index in duplicating_dropdowns[dropdowns[dropdown_keys[key]]]) {
                  let duplicated_el = duplicating_dropdowns[dropdowns[dropdown_keys[key]]][index];
                    
                  if(part_data[duplicated_el] != undefined && data[opt].id === part_data[duplicated_el].id){
                    this.setState({['selected_'+duplicated_el]:data[opt]});
                  }
                }
              }
            }  

            this.setState({[dropdowns[dropdown_keys[key]]]: data, ['selected_'+dropdown_keys[key]]:selected, part:part_data});

        }.bind(this));
    }
  }

  checkDataFormat() {
    let part = this.state.part;
    let related_data = ['user','condition','release','owner','seller','primary_contact','location'];
    related_data.map((val, i) => {
      part[val] = this.state['selected_'+val].value;
    })
    this.setState({part:part});
  }

  selectChange(value, key) {
    let part = this.state.part;
    part[key] = value && value.value ? value.value : '';
    this.setState({ ['selected_'+key]: value ? value : '', part: part});
  }

  setTab(event, tab) {
    document.getElementById('part-tabs-tab-'+tab).click();
  }

  render() {
    const { validated, part, selectedFile, selected_location, countries, selected_primary_contact,
      contacts, selected_owner, companies, selected_seller, selected_user, users, conditions,
      selected_condition, releases, selected_release, selected_unit_measure} = this.state;
    return (
      <Form
        noValidate
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>User *</Form.Label>
              <Select
                value={selected_user}
                model="user"
                name="name"
                isClearable = {true}
                escapeClearsValue = {true}
                onChange={e => this.selectChange(e, 'user')}
                options={users}
              />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Part Number *</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="part"
              name="part_number"
              defaultValue={part ? part.part_number:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Alternate Part Number</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="part"
              name="alternate_part_number"
              defaultValue={part ? part.alternate_part_number:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Condition *</Form.Label>
            <Select
              value={selected_condition}
              model="condition"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'condition')}
              options={conditions}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Release</Form.Label>
            <Select
              value={selected_release}
              model="release"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'release')}
              options={releases}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Quantity *</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="part"
              name="quantity"
              defaultValue={part ? part.quantity:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Primary Contact *</Form.Label>
            <Select
              value={selected_primary_contact}
              model="primary_contact"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'primary_contact')}
              options={contacts}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Location</Form.Label>
            <Select
              value={selected_location}
              model="location"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'location')}
              options={countries}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Unit Measure</Form.Label>
            <Select
              value={selected_unit_measure}
              model="part"
              name="unit_measure"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'unit_measure')}
              options={UNIT_MEASURES}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Price</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="part"
              name="price"
              defaultValue={part ? part.price:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Owner</Form.Label>
              <Select
                value={selected_owner}
                model="owner"
                name="name"
                isClearable = {true}
                escapeClearsValue = {true}
                onChange={e => this.selectChange(e, 'owner')}
                options={companies}
              />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Seller</Form.Label>
              <Select
                value={selected_seller}
                model="seller"
                name="name"
                isClearable = {true}
                escapeClearsValue = {true}
                onChange={e => this.selectChange(e, 'seller')}
                options={companies}
              />
          </Form.Group>
        </Form.Row>
        <Button type="submit" onClick={(e) => this.setState({action:'save'})} className="btn btn-primary">
          <i className="la la-edit" />
          Update
        </Button>
        &nbsp;&nbsp;
        <Link to={"/admin/part/asset"} className="btn btn-danger">
          <i className="la la-remove" />
          Cancel
        </Link>
      </Form>
    );
  }
}

class CreatePage extends React.Component {
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
              beforeCodeTitle={"Part"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/admin/part/asset"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                  </div>
                </div>
              </div>
            </div>
            }>
              <div className="kt-section">
                <Create data={this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(CreatePage);