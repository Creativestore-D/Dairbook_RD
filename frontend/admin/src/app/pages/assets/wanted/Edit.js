import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, ASSETS, AIRCRAFT_TERMS, ENGINE_TERMS, PART_TERMS, UNIT_MEASURES, post} from "../../../crud/api";
import Select from 'react-select';
import DateFnsUtils from '@date-io/date-fns';
import Grid from "@material-ui/core/Grid";
import { MuiPickersUtilsProvider,DatePicker } from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import moment from "moment";

const defaultMaterialTheme = createMuiTheme({
  props: {
    MuiInput:{
      disableUnderline: true,
    },
    MuiTextField:{
      style: {
          display: "block",
      },
    },
    MuiInputBase: {
      style: {
          display: "block",
      },
      disableUnderline: true,
      inputProps: {
        style: {
          display: "block",
          height: "calc(1.5em + 1.3rem + 2px)",
          padding: "0.65rem 1rem",
          fontSize: "1rem",
          fontWeight: "400",
          lineHeight: "1.5",
          color: "#495057",
          backgroundColor: "#fff",
          backgroundClip: "padding-box",
          border: "1px solid #e2e5ec",
          borderRadius: "4px",
          transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          boxSizing: "border-box",
        }
      }
    },
  },
});


class Edit extends React.Component {

  constructor(props) {
   super(props);
   const { wanted_id, type } = this.props.data.match.params

   this.state = { 
      validated: false, 
      wanted:{}, 
      selectedFile: null,
      manufacturer:[],
      countries:[],
      type_0:[],
      contacts:[],
      model:[],
      users:[],
      selected_primary_contact:{value:''},
      selected_type:{value:''},
      selected_type_0:{value:''},
      selected_manufacturer:{value:''},
      selected_country:{value:''},
      selected_model:{value:''},
      selected_user:{value:''},
      selected_terms:{value:''},
      yom: new Date(),
    };
    this.getWanted(wanted_id);
  }

  getWanted(wanted_id) {
    list('wanteds/'+wanted_id+'/').then(
      (response) => {
          this.setState({wanted : response.data, yom : moment(response.data.yom, 'YYYY'),})
          // this.getDropdownsListing();
          this.loadModels();

          this.setDynamicDropdowns(this.state.selected_type, 'type', null);

          if(response.data.manufacturer.id != undefined && response.data.manufacturer.id != "")
            this.setDynamicDropdowns(this.state.selected_type, 'manufacturer', response.data.manufacturer.id);

          if(response.data.type_0.id != undefined && response.data.type_0.id != "")
            this.setDynamicDropdowns(this.state.selected_type, 'type_0', response.data.type_0.id);
    });
  }

  loadModels() {
        let wanted_data = this.state.wanted;

        // static dropdowns calculation here -

        let static_dropdowns = { // when you have static dropdown like gender just put here
          type: ASSETS,
        }
        if(this.state.wanted.type == 'aircraft')
          static_dropdowns.terms = AIRCRAFT_TERMS;
        else if(this.state.wanted.type == 'engine' || this.state.wanted.type == 'apu')
          static_dropdowns.terms = ENGINE_TERMS;
        else if(this.state.wanted.type == 'parts')
          static_dropdowns.terms = PART_TERMS;

        let dropdown_keys = Object.keys(static_dropdowns);
        for(let key in dropdown_keys) {
          for(let index in static_dropdowns[dropdown_keys[key]]) {
            if(static_dropdowns[dropdown_keys[key]][index].value === wanted_data[dropdown_keys[key]]){
              this.setState({['selected_'+dropdown_keys[key]]:static_dropdowns[dropdown_keys[key]][index]});
              break;
            }
          }
        }

        let models = {
          'AbUsers':{},
          'AbContacts':{},
          'AbCountries':{},
          'AbManufacturers':{type: this.state.wanted.type},
        }

        // lets do some mapping to avoid if else conditions
        let state_endpoints = {
          AbUsers:['user'],
          AbContacts:['primary_contact'],
          AbCountries:['country'],
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
                  if(opt === key && wanted_data[state] !== null && wanted_data[state].id !== undefined && wanted_data[state].id === row.id)
                    newStates['selected_'+state] = row;
                })
              })

            })
          }
          newStates['users'] = response.data.AbUsers;
          newStates['contacts'] = response.data.AbContacts;
          newStates['countries'] = response.data.AbCountries;
          newStates['manufacturer'] = response.data.AbManufacturers;

          this.setState(newStates);
        }.bind(this))
  }

  handleChange(event, type) {
    var wanted = this.state.wanted;
    if(type !== 'wanted_by' && type !== 'yom'){
      var attr = event.target.name;
      var val = event.target.value;
    }else if(type == 'yom'){
      var attr = type;
      var val = moment(event).format("YYYY");
      this.setState({yom : event})
    }
    else{
      var attr = type;
      var val = moment(event).format("YYYY-MM-DD");
      this.setState({date : event})
    }
    if(attr === 'is_active')
      val = parseInt(val);
      wanted[attr] = val;
    this.setState({wanted : wanted})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    this.checkDataFormat(); // this is done to convert foregin table objects into pk
    if(!this.state.selectedFile)
      delete this.state.wanted.file;
    patch('wanteds/'+this.state.wanted.id+'/', this.state.wanted).then(
      (response) => {
        this.setState({wanted : response.data});
        this.props.data.history.push(this.state.action == 'save_new' ? "/admin/wanted/asset/create":"/admin/wanted/asset");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  checkDataFormat() {
    let wanted = this.state.wanted;
    let related_data = ['user','primary_contact','country', 'manufacturer', 'type_0', 'model'];
    related_data.map((val, i) => {
      wanted[val] = this.state['selected_'+val].value;
    })
    this.setState({wanted:wanted});
  }

  getDropdownsListing() {
    let wanted_data = this.state.wanted;
    let dropdowns = {// when you have database dropdown like departments just put here
      // dbcolumn: api_endpoint
      primary_contact:'contacts',
      country: 'countries',
      user:'users',
    }

    let duplicating_dropdowns = {
    }

    // static dropdowns calculation here - 
    let static_dropdowns = { // when you have static dropdown like gender just put here
      // dbcolumn: imported name
      type: ASSETS,
    }
    if(this.state.wanted.type == 'aircraft')
      static_dropdowns.terms = AIRCRAFT_TERMS;
    else if(this.state.wanted.type == 'engine' || this.state.wanted.type == 'apu')
      static_dropdowns.terms = ENGINE_TERMS;
    else if(this.state.wanted.type == 'parts')
      static_dropdowns.terms = PART_TERMS;

    let dropdown_keys = Object.keys(static_dropdowns);
    for(let key in dropdown_keys) {
      for(let index in static_dropdowns[dropdown_keys[key]]) {
        if(static_dropdowns[dropdown_keys[key]][index].value === wanted_data[dropdown_keys[key]]){
          this.setState({['selected_'+dropdown_keys[key]]:static_dropdowns[dropdown_keys[key]][index]});
          break;
        }
      }
    }

    dropdown_keys = Object.keys(dropdowns);
    for(let key in dropdown_keys) {
      let params = {records:'all'}
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

              if(wanted_data[dropdown_keys[key]] != undefined && data[opt].id === wanted_data[dropdown_keys[key]].id)
                selected = data[opt]

              if(duplicating_dropdowns[dropdowns[dropdown_keys[key]]] != undefined) {
                for(let index in duplicating_dropdowns[dropdowns[dropdown_keys[key]]]) {
                  let duplicated_el = duplicating_dropdowns[dropdowns[dropdown_keys[key]]][index];
                    
                  if(wanted_data[duplicated_el] != undefined && data[opt].id === wanted_data[duplicated_el].id){
                    this.setState({['selected_'+duplicated_el]:data[opt]});
                  }
                }
              }
            }  

            this.setState({[dropdowns[dropdown_keys[key]]]: data, ['selected_'+dropdown_keys[key]]:selected, part:wanted_data});

        }.bind(this));
    }
  }

  selectChange(value, key) {
    let wanted = this.state.wanted;
    wanted[key] = value && value.value ? value.value : '';
    this.setState({ ['selected_'+key]: value ? value : '', wanted: wanted});

    let type = value ? value : '';
    if(key !== 'type')
      type = this.state.selected_type;

    this.setDynamicDropdowns(type, key, value ? value.id : '');
  }

  setDynamicDropdowns(type, key, id) {
    if(['manufacturer', 'type', 'type_0'].indexOf(key) > -1 && type !== '' && id !== '')  {
      if(['aircraft', 'engine', 'apu'].indexOf(type.value) > -1) {
        let endpoint = '', params={}, key_to_update = '', models = {};
        if(key === 'manufacturer'){
          models = {
            AbTypes : {manufacturer_id:id, type: type.value}
          }
          key_to_update = 'type_0';
        } 
        else if(key === 'type_0'){
          models = {
            AbModels : {type_0:id, type: type.value}
          }
          key_to_update = 'model';
        }
        else if(key === 'type'){
          models = {
            AbManufacturers : {type: type.value}
          }
          key_to_update = 'manufacturer';
        }

        post('abmodels', {models:models}).then(function(response){
            let selected = {};
            for(let opt in response.data){
                response.data[opt].map((row, i) => {
                  response.data[opt][i].label = row.name;
                  response.data[opt][i].value = row.id;
                  selected = row;
                })
                this.setState({
                  [key_to_update]:response.data[opt], ['selected_'+key_to_update]:selected
                })
            }

        }.bind(this));
      }
    }
  }


  render() {
    const { date, wanted, selected_manufacturer, manufacturer, 
      selected_country, countries, selected_type, type_0, selected_type_0,
      selected_primary_contact, contacts, model, selected_model, selected_user, users, 
      selected_terms, yom} = this.state;
    return (
      <Form
        noValidate
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Wanted Asset *</Form.Label>
            <Select
              value={selected_type}
              model="type"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'type')}
              options={ASSETS}
            />
          </Form.Group>
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
          {selected_type.value !== 'parts' && selected_type.value !== '' ? 
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>{selected_type.label} Manfacturer {selected_type.value === 'aircraft' ? '*' :''}</Form.Label>
            <Select
              value={selected_manufacturer}
              model="manufacturer"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'manufacturer')}
              options={manufacturer}
            />
          </Form.Group> : ''}
          {selected_type.value !== 'parts' && selected_type.value !== '' ? 
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>{selected_type.label} Type {selected_type.value === 'aircraft' || selected_type.value === 'apu' ? '*' :''}</Form.Label>
            <Select
              value={selected_type_0}
              model="type_0"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'type_0')}
              options={type_0}
            />
          </Form.Group> : ''}
          {selected_type.value !== 'parts' && selected_type.value !== '' ? 
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>{selected_type.label} Model</Form.Label>
            <Select
              value={selected_model}
              model="model"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'model')}
              options={model}
            />
          </Form.Group> : ''}
          {selected_type.value === 'aircraft' ? 
            <Form.Group as={Col} md="4" xs="12">
              <Form.Label>YOM</Form.Label>
              <ThemeProvider theme={defaultMaterialTheme}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    views={["year"]}
                    minDate = {new Date('1990')}
                    name="yom"
                    value={yom}
                    onChange={e => this.handleChange(e,'yom')}
                  />
              </MuiPickersUtilsProvider>
                </ThemeProvider>
            </Form.Group> : ''
          }
          {selected_type.value === 'parts' || selected_type.value === 'apu' ? 
            <Form.Group as={Col} md="4" xs="12">
              <Form.Label>Part Number *</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder=""
                model="wanted"
                name="yom"
                defaultValue={wanted ? wanted.part_number:''}
                onChange={e => this.handleChange(e)}
              />
            </Form.Group> : ''}
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
            <Form.Label>Location *</Form.Label>
            <Select
              value={selected_country}
              model="country"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'country')}
              options={countries}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Wanted By</Form.Label>
            <ThemeProvider theme={defaultMaterialTheme}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  minDate = {new Date('1990-01-01')}
                  value={date}
                  format="dd/MM/yyyy"
                  onChange={e => this.handleChange(e, 'wanted_by')}
                  animateYearScrolling
                />
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </Form.Group>
          {selected_type.value !== '' ? 
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Wanted Terms *</Form.Label>
            <Select
              value={selected_terms}
              model="terms"
              name="name"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectChange(e, 'terms')}
              options={selected_type.value === 'aircraft' ? AIRCRAFT_TERMS : (selected_type.value === 'parts' ? PART_TERMS : (selected_type.value === 'engine' || selected_type.value === 'apu' ? ENGINE_TERMS : [])) }
            />
          </Form.Group> : ''}
          <Form.Group as={Col} xs="12">
            <Form.Label>Comments</Form.Label>
            <Form.Control as="textarea" rows="5"
              required
              type="text"
              placeholder=""
              model="wanted"
              name="comments"
              defaultValue={wanted ? wanted.comments:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
        </Form.Row>
        <Button type="submit" onClick={(e) => this.setState({action:'save'})} className="btn btn-primary">
          <i className="la la-save" />
          Update
        </Button>
        &nbsp;&nbsp;

        <Link to={"/admin/wanted/asset"} className="btn btn-danger">
          <i className="la la-remove" />
          Cancel
        </Link>
      </Form>
    );
  }
}

class EditPage extends React.Component {
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
              beforeCodeTitle={"Wanted"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/admin/wanted/asset"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                  </div>
                </div>
              </div>
            </div>
            }>
              <div className="kt-section">
                <Edit data={this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(EditPage);