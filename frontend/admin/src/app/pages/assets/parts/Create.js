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
import { list, post, MEDIA_URL, ENGINE_STATUSES, ENGINE_OFFER, UNIT_MEASURES } from "../../../crud/api";
import Select from 'react-select';


class Create extends React.Component {

  constructor(props) {
   super(props);
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
      selected_primary_contact:{label: 'Select..', value:''},
      selected_owner:{label: 'Select..', value:''},
      selected_seller:{label: 'Select..', value:''},
      selected_user:{label: 'Select..', value:''},
      selected_release:{label: 'Select..', value:''},
      selected_unit_measure:{label: 'Select..', value:''},
      selected_condition:{label: 'Select..', value:''}
    };
    // this.getDropdownsListing();
    this.loadModels();
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
    if(!this.state.selectedFile)
      delete this.state.part.file;
    post('parts', this.state.part).then(
      (response) => {
        this.setState({part : response.data});
        this.state.action == 'save_new' ? this.clearForm("parts-form"):this.props.data.history.push("/admin/part/asset");
    })
    .catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  loadModels() {
		let models = {
			'AbUsers':{},
			'AbContacts':{},
			'AbConditions':{},
			'AbReleases':{},
			'AbCountries':{},
			'AbCompanies':{},
		}
		post('abmodels', {models:models}).then(function(response){
			for(let opt in response.data){

				response.data[opt].map((row, i) => {
					if(opt === 'AbContacts' || opt === 'AbUsers')
						row.name = row.first_name+' '+row.last_name;

          if (opt === 'AbUsers')
              row.id = row.user_id;
            
					response.data[opt][i].label = row.name;
					response.data[opt][i].value = row.id;
				})
			}
			this.setState({
				users:response.data.AbUsers,
				contacts:response.data.AbContacts,
				conditions:response.data.AbConditions,
				releases:response.data.AbReleases,
				countries:response.data.AbCountries,
				companies:response.data.AbCompanies,
			})
		}.bind(this))
  }

  getDropdownsListing() {
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

    let dropdown_keys = Object.keys(dropdowns);
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

              if(this.state.part[dropdown_keys[key]] != undefined && data[opt].id === this.state.part[dropdown_keys[key]].id)
                selected = data[opt]

              if(duplicating_dropdowns[dropdowns[dropdown_keys[key]]] != undefined) {
                for(let index in duplicating_dropdowns[dropdowns[dropdown_keys[key]]]) {
                  let duplicated_el = duplicating_dropdowns[dropdowns[dropdown_keys[key]]][index];
                  if(this.state.part[duplicated_el] != undefined && data[opt].id === this.state.part[duplicated_el].id)
                    this.setState({['selected_'+duplicated_el]:selected});
                }
              }
            }  

              console.log(selected);
            this.setState({[dropdowns[dropdown_keys[key]]]: data, ['selected_'+dropdown_keys[key]]:selected});

        }.bind(this));
    }
  }

  selectChange(value, key) {
    let part = this.state.part;
    part[key] = value && value.value ? value.value : '';
    this.setState({ ['selected_'+key]: value ? value : '', part: part});
  }

  setTab(event, tab) {
    document.getElementById('part-tabs-tab-'+tab).click();
  }
  
  clearForm = (id) => { 
        this.props.data.history.replace("/admin/part/asset");
        this.props.data.history.replace("/admin/part/asset/create");
  }
  render() {
    const { validated, part, selectedFile, selected_location, countries, selected_primary_contact,
      contacts, selected_owner, companies, selected_seller, selected_user, users, conditions,
      selected_condition, releases, selected_release, selected_unit_measure} = this.state;
    return (
      <Form
        noValidate
        id = "parts-form"
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
          <i className="la la-save" />
          Save & Close
        </Button>
        &nbsp;&nbsp;

        <Button type="submit" onClick={(e) => this.setState({action:'save_new'})} className="btn btn-success">
          <i className="la la-save" />
          Save & New
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