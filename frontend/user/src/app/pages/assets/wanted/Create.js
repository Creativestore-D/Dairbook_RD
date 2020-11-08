import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col } from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import { list, post, ASSETS, AIRCRAFT_TERMS, ENGINE_TERMS, PART_TERMS, USER_URL } from "../../../crud/api";
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

class Create extends React.Component {

  constructor(props) {
   super(props);
   this.state = { 
      validated: false, 
      wanted:{yom: new Date()}, 
      selectedFile: null,
      manufacturer:[],
      countries:[],
      type_0:[],
      contacts:[],
      model:[],
      selected_primary_contact:{value:''},
      selected_type:{value:''},
      selected_type_0:{value:''},
      selected_manufacturer:{value:''},
      selected_country:{value:''},
      selected_model:{value:''},
      selected_terms:{value:'aaa'},
      yom: new Date(),
    };
    this.getDropdownsListing();
  }

  handleChange(event, type) {
    var wanted = this.state.wanted;
    if(type !== 'date' && type !== 'yom'){
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
    if(!this.state.selectedFile)
      delete this.state.wanted.file;
    post('wanteds', this.state.wanted).then(
      (response) => {
        this.setState({wanted : response.data});
        this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm("wanted-form"):"/"+USER_URL+"/wanted/asset");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  getDropdownsListing() {
    let dropdowns = {// when you have database dropdown like dewantedments just put here
      // dbcolumn: api_endpoint
      primary_contact:'contacts',
      country: 'countries',
      user:'users',
      manufacturer:'manufacturer',
      // type_0:'type',
      model:'model',
    }

    let duplicating_dropdowns = {
    }

    let dropdown_keys = Object.keys(dropdowns);
    for(let key in dropdown_keys) {
      let params = {}
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

              if(this.state.wanted[dropdown_keys[key]] != undefined && data[opt].id === this.state.wanted[dropdown_keys[key]].id)
                selected = data[opt]

              if(duplicating_dropdowns[dropdowns[dropdown_keys[key]]] != undefined) {
                for(let index in duplicating_dropdowns[dropdowns[dropdown_keys[key]]]) {
                  let duplicated_el = duplicating_dropdowns[dropdowns[dropdown_keys[key]]][index];
                  if(this.state.wanted[duplicated_el] != undefined && data[opt].id === this.state.wanted[duplicated_el].id)
                    this.setState({['selected_'+duplicated_el]:selected});
                }
              }
            }
            this.setState({[dropdowns[dropdown_keys[key]]]: data, ['selected_'+dropdown_keys[key]]:selected});

        }.bind(this));
    }
  }

  selectChange(value, key) {
    let wanted = this.state.wanted;
    wanted[key] = value.value;
    this.setState({ ['selected_'+key]: value, wanted: wanted});

    let type = value;
    if(key !== 'type')
      type = this.state.selected_type;


    if(['manufacturer', 'type', 'type_0'].indexOf(key) > -1)  {
      if(['aircraft', 'engine', 'apu'].indexOf(type.value) > -1) {
        let endpoint = '', params={}, key_to_update = '';
        if(key === 'manufacturer'){
          endpoint = 'type';
          params = {is_active:1, manufacturer_id:value.id, type:type.value}
          key_to_update = 'type_0';
        } 
        else if(key === 'type_0'){
          endpoint = 'model';
          params = {is_active:1, type_0:value.id, type:type.value}
          key_to_update = 'model';
        }
        else if(key === 'type'){
          endpoint = 'manufacturer';
          params = {is_active:1, type:type.value}
          key_to_update = 'manufacturer';
        }

        list(endpoint, params).then(function(response){
            let data = response.data;
            let selected = {};
            for(let opt in data){
              if(this.state.wanted[key_to_update] != undefined && data[opt].id === this.state.wanted[key_to_update].id) {
                selected['label'] = data[opt].name;
                selected['value'] = data[opt].id;
              }
              data[opt].label = data[opt].name;    
              data[opt].value = data[opt].id;   
            }
            this.setState({[key_to_update]: data, ['selected_'+key_to_update]:selected});

        }.bind(this));
      }
    }
  }
  clearForm = (id) => { 
    document.getElementById(id).reset();
    this.setState({selectedFile: null, previewFile: null});
  }
  render() {
    const { date, wanted, selectedFile, selected_manufacturer, manufacturer, 
      selected_country, countries, selected_type, type_0, selected_type_0,
      selected_primary_contact, contacts, model, selected_model, 
      selected_terms, yom} = this.state;
    return (
      <Form
        noValidate
        id = "wanted-form"
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="12" xs="12">
            <Form.Label>Wanted Asset</Form.Label>
            <Select
              value={selected_type}
              model="type"
              name="name"
              onChange={e => this.selectChange(e, 'type')}
              options={ASSETS}
            />
          </Form.Group>
          {selected_type.value !== 'parts' && selected_type.value !== '' ? 
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>{selected_type.label} Manfacturer</Form.Label>
            <Select
              value={selected_manufacturer}
              model="manufacturer"
              name="name"
              onChange={e => this.selectChange(e, 'manufacturer')}
              options={manufacturer}
            />
          </Form.Group> : ''}
          {selected_type.value !== 'parts' && selected_type.value !== '' ? 
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>{selected_type.label} Type</Form.Label>
            <Select
              value={selected_type_0}
              model="type_0"
              name="name"
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
              onChange={e => this.selectChange(e, 'model')}
              options={model}
            />
          </Form.Group> : ''}
          {selected_type.value === 'aircraft' ? 
            <Form.Group as={Col} md="4" xs="12">
              <Form.Label>YOM</Form.Label>
              <ThemeProvider theme={defaultMaterialTheme}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container>
                  <DatePicker
                    views={["year"]}
                    minDate = {new Date('1990')}
                    name="yom"
                    value={yom}
                    onChange={e => this.handleChange(e,'yom')}
                  />

                </Grid>
              </MuiPickersUtilsProvider>
              </ThemeProvider>
            </Form.Group>
             : ''
          }
          {selected_type.value === 'parts' || selected_type.value === 'apu' ? 
            <Form.Group as={Col} md="4" xs="12">
              <Form.Label>Part Number</Form.Label>
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
            <Form.Label>Primary Contact</Form.Label>
            <Select
              value={selected_primary_contact}
              model="primary_contact"
              name="name"
              onChange={e => this.selectChange(e, 'primary_contact')}
              options={contacts}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Location</Form.Label>
            <Select
              value={selected_country}
              model="country"
              name="name"
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
                  onChange={e => this.handleChange(e, 'date')}
                  animateYearScrolling
                />
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </Form.Group>
          {selected_type.value !== '' ? 
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Wanted Terms</Form.Label>
            <Select
              value={selected_terms}
              model="terms"
              name="name"
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
          Save & Close
        </Button>
        &nbsp;&nbsp;

        <Button type="submit" onClick={(e) => this.setState({action:'save_new'})} className="btn btn-success">
          <i className="la la-save" />
          Save & New
        </Button>
        &nbsp;&nbsp;

        <Link to={"/"+USER_URL+"/wanted/asset"} className="btn btn-danger">
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
                  <Link to={"/"+USER_URL+"/wanted/asset"} className="btn btn-clean btn-icon-sm">
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