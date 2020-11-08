import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import {
  Radio,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import { list, patch, PERMISSIONS } from "../../../crud/api";
import Select from 'react-select';
import ReactDOM from 'react-dom'
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";


const $ = require('jquery');
$.DataTable = require('datatables.net-responsive-bs4');

const checkbox_checked = `<span class="MuiButtonBase-root MuiIconButton-root PrivateSwitchBase-root-7 MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-checked-8 Mui-checked MuiIconButton-colorPrimary" aria-disabled="false"><span class="MuiIconButton-label"><input class="PrivateSwitchBase-input-10" type="checkbox" data-indeterminate="false" aria-label="default checkbox" value="163" checked=""><svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg></span><span class="MuiTouchRipple-root"></span></span>`;
const checkbox_unchecked = `<span class="MuiButtonBase-root MuiIconButton-root PrivateSwitchBase-root-7 MuiCheckbox-root MuiCheckbox-colorPrimary MuiIconButton-colorPrimary" aria-disabled="false"><span class="MuiIconButton-label"><input class="PrivateSwitchBase-input-10" type="checkbox" data-indeterminate="false" aria-label="secondary checkbox" value="158"><svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg></span><span class="MuiTouchRipple-root"></span></span>`;

class Edit extends React.Component {
  constructor(props) {
    super(props);

    const { user_id } = this.props.data.match.params
    this.state = { 
      table: null,
      user:{id:user_id}, 
      contenttypes:[], 
    };

    this.handleChange = this.handleChange.bind(this);
    this.parseRowData = this.parseRowData.bind(this);
    this.createDataArray = this.createDataArray.bind(this);
    this.loadDatatable = this.loadDatatable.bind(this);
    this.getContenttypes(null);
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate(prevProps, prevState) {
    this.loadDatatable();
  }

  getUser() {
    list('users/'+this.state.user.id+'/').then(
      (response) => {
          this.setState({user : response.data});
          this.props.setUser(response.data);
    });
  }

  getContenttypes(search) {
    let filter = {};
    if(search != null)
      filter = {...filter, ...search }
    list('contenttypes', filter).then(
      (response) => {
          this.setState({contenttypes : response.data});
    });
  }

  loadDatatable(){
    var $this = this;
     if ( $.fn.dataTable.isDataTable( '#role_perm_table' ) ) {
          this.state.table.clear();
          this.state.table.rows.add($this.parseRowData(this.state.contenttypes));
          this.state.table.draw();
      }
      else {

          this.state.table = $('#role_perm_table');
          this.state.table = this.state.table.DataTable({
              responsive: true,
             data: $this.parseRowData(this.state.contenttypes),

            // DOM Layout settings
            dom: `<'row'<'col-sm-12'tr>>
           <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,

            lengthMenu: [5, 10, 25, 50],

            pageLength: 10,

            language: {
                'lengthMenu': 'Display _MENU_',
            },

            // Order settings
            order: [[1, 'asc']],
            columnDefs: [

            { "bVisible": false, "aTargets": [0] },

            {
              targets: -1,
              orderable: false,
              "createdCell": function (td, cellData, rowData, row, col) {
                   ReactDOM.render(
                    <Checkbox
                        checked={cellData.checked}
                        color="primary"
                        value={cellData.permission_id}
                        onChange={e => $this.handleChange(e, cellData, row, col, td)}
                        inputProps={{
                          'aria-label': 'secondary checkbox',
                        }}
                      />
                    , td)
                }
            },

            {
              targets: -2,
              orderable: false,
              "createdCell": function (td, cellData, rowData, row, col) {
                   ReactDOM.render(
                    <Checkbox
                        checked={cellData.checked}
                        value={cellData.permission_id}
                        onChange={e => $this.handleChange(e, cellData, row, col, td)}
                        color="primary"
                        inputProps={{
                          'aria-label': 'default checkbox',
                        }}
                      />
                    , td)
                }
            },

            {
              targets: -3,
              orderable: false,
              "createdCell": function (td, cellData, rowData, row, col) {
                   ReactDOM.render(
                    <Checkbox
                        color="primary"
                        checked={cellData.checked}
                        value={cellData.permission_id}
                        onChange={e => $this.handleChange(e, cellData, row, col, td)}
                        inputProps={{
                          'aria-label': 'secondary checkbox',
                        }}
                      />
                    , td)
                }
            },

            {
              targets: -4,
              orderable: false,
              "createdCell": function (td, cellData, rowData, row, col) {
                   ReactDOM.render(
                    <Checkbox
                        color="primary"
                        checked={cellData.checked}
                        value={cellData.permission_id}
                        onChange={e => $this.handleChange(e, cellData, row, col, td)}
                        inputProps={{
                          'aria-label': 'secondary checkbox',
                        }}
                      />
                    , td)
                }
            },
          ],
        });
      }
  }

  handleChange(event, cellData, row, col, td) {
    let checkbox = '';
    let user = this.state.user;
    if(cellData.checked)
      user.user_permissions.splice(user.user_permissions.indexOf(cellData.permission_id), 1);
    else 
      user.user_permissions.push(cellData.permission_id);

    this.setState({user : user});
    let apiData = {'user_permissions':user.user_permissions};
    // this.state.table.cell({row:row, column:col}).data(cellData.checked ? checkbox_unchecked : checkbox_checked);
    patch('users/'+this.state.user.id+'/', apiData).then(
      (response) => {
    });
  }

  handleSearch(event) {
    this.getContenttypes({search:event.target.value});
  }

  parseRowData(rowData) {
      let $this = this;
      const JsonArray = [];
      rowData.forEach(function(item, index){
          JsonArray.push($this.createDataArray(item.id, item.model.charAt(0).toUpperCase() + item.model.slice(1), item.permission_set));
      });
      return JsonArray;
  }

  createDataArray(id, name, user_permissions ) {
    let data = [id, name];
    for(let i in user_permissions) {
      let permission = {content_type_id:id, permission_id: user_permissions[i].id};
      if(this.state.user.user_permissions && this.state.user.user_permissions.indexOf(user_permissions[i].id) > -1)
        permission.checked = true;
      else 
        permission.checked = false;
      data.push(permission);
    }
    return data;
  }

  render() {
    return (
      <div className="kt-form kt-form--label-right kt-margin-t-20 kt-margin-b-10">
        <div className="row align-items-center">
          <div className="col-xl-12 order-2 order-xl-1">
            <div className="row align-items-center">
              <div className="col-md-4 kt-margin-b-20-tablet-and-mobile">
                <div className="kt-input-icon kt-input-icon--left">
                  <input onKeyUp={e => this.handleSearch(e)}  type="text" className="form-control" placeholder="Search..." id="generalSearch" />
                  <span className="kt-input-icon__icon kt-input-icon__icon--left">
                    <span><i className="la la-search" /></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const { Formik } = formik;


class EditPage extends React.Component {
   constructor(props) {
    super(props);
    this.setPrevUrl();
    this.state = {errors:{}, showError:false, user:{}};
    this.sendError = this.sendError.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  setPrevUrl() {
    this.prev_url = this.props.match.url.split('/')[2];
    if(this.prev_url == 'admin-user')
      this.prev_url = '/admin/admin-user';
    else
      this.prev_url = '/admin/airbookers';
  }

  sendError(error) {
    if(Object.keys(error).length)
      this.setState({showError:true});

    this.setState({errors:error});
  }

  setUser(user) {
    this.setState({user:user});
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
              beforeCodeTitle={this.state.user.contact ? this.state.user.contact.first_name+' '+this.state.user.contact.last_name:'User'}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={this.prev_url} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                  </div>
                </div>
              </div>
            </div>}
            >
              <div className="kt-section">
                <Edit data = {this.props} setUser={this.setUser} sendError={this.sendError} />
                <div>
                  <table className="table table-striped- table-bordered table-hover table-checkable" id="role_perm_table">
                      <thead>
                      <tr>
                          <th>Id</th>
                          <th>Module</th>
                          <th>Create</th>
                          <th>Edit</th>
                          <th>Delete</th>
                          <th>View</th>
                      </tr>
                      </thead>
                  </table>
                </div>
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(EditPage);