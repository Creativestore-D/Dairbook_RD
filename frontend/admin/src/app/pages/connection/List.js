import React from 'react';
import ReactDOM from 'react-dom'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Delete as DeleteIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon, Info as InfoIcon,
    Warning as WarningIcon
} from '@material-ui/icons';
import { amber, green } from '@material-ui/core/colors';
import {
    IconButton, Paper, FormControlLabel, Switch, Snackbar, Checkbox, Toolbar, Tooltip, Typography, SnackbarContent, Grid, List, ListItem, ListItemText, Divider
} from '@material-ui/core';
import { list, patch, del, userHasPermission} from "../../crud/api";
import {Button, Dropdown, Modal} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";
import {Link} from "react-router-dom";
import Notice from "../../partials/content/Notice";
import {ReactComponent as SortNum1Icon} from "../../../_metronic/layout/assets/layout-svg-icons/SortNum1.svg";
import moment from "moment";

const QuickActionsDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
        ref={ref}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
        className="btn kt-header__btn-primary"
    >
      Actions
      <SortNum1Icon className="kt-svg-icon kt-svg-icon--sm" />
    </button>
));

function createDataArray(checkbox, id, leadable_id, creator_id, company, lead_status, date, status, action ) {
  return [checkbox, id, leadable_id, creator_id, company, lead_status, date, status, action ];
}

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStylesSnackbarContent = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function SnackbarContentWrapper(props) {
  const classes = useStylesSnackbarContent();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

SnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    display: 'block',
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected, type, selected, setSelected, setSelectedMany, setRowsData, rows, setTemp } = props;


  function handleDelAll(event) {
    if(selected.length) {
      let data = {ids:selected}
      del('leads/'+selected[0]+'/', data).then(function (response) {
        // here removing rows from dt-table that are deleted from database
        for(let i in rows){
          if(selected.indexOf(rows[i].id) > -1) {
            delete rows[i];
          }
        }
        setRowsData(rows);
        selected.length = 0;
        setSelected(selected);
        setSelectedMany(false);

        // no use as such - just to trigger state udpate :(
        const newArr = [];
        newArr.push(1);
        setTemp(newArr);
      })
    }
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
        <div className="kt-portlet__head kt-portlet__head--lg">
            <div className="kt-portlet__head-label">
              <span className="kt-portlet__head-icon">
                <i className="kt-font-brand flaticon2-line-chart" />
              </span>
                {numSelected > 0 ? (
                  <Typography color="inherit" variant="subtitle1">
                    {numSelected} selected
                  </Typography>
                ) : (
                  <h3 className="kt-portlet__head-title">
                   Leads
                  </h3>
                )}
            </div>
            <div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                      {numSelected > 0 ? (
                          <Tooltip title="Delete">
                            <IconButton onClick={(e) => handleDelAll(e)} aria-label="Delete">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                      ) : (
                          <div className="btn-group">
                            {/*<Link to={"/lead/create"} className="btn btn-sm btn-brand btn-elevate btn-icon-sm new-record">
                                <i className="la la-plus"></i>
                                New Record
                            </Link>*/}
                              <Dropdown className="dropdown-inline" drop="down" alignRight>
                                <Dropdown.Toggle as={QuickActionsDropdownToggle}
                                  id="dropdown-toggle-quick-actions-subheader"
                                />

                                <Dropdown.Menu className="dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                                  <ul className="kt-nav">
                                    <li className="kt-nav__item">
                                      <a href="#" className="kt-nav__link">
                                        <i className="kt-nav__link-icon la la-upload" />
                                        <span className="kt-nav__link-text">Export</span>
                                      </a>
                                    </li>
                                    <li className="kt-nav__item">
                                      <a href="#" className="kt-nav__link">
                                        <i className="kt-nav__link-icon la la-download" />
                                        <span className="kt-nav__link-text">Import</span>
                                      </a>
                                    </li>
                                  </ul>
                                </Dropdown.Menu>
                              </Dropdown>
                          </div>
                      )}
                </div>
              </div>
            </div>
          </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  close: {
    padding: theme.spacing(0.5),
  },
}));

const $ = require('jquery');
$.DataTable = require('datatables.net-responsive-bs4');

function updateTable(newData, type) {
    const table = $('#leads').DataTable();
    table.clear();
    table.rows.add(newData);
    table.draw();
}

function parseRowData(rowData) {
    const JsonArray = [];

    if( Array.isArray(rowData) && rowData.length > 0){
      rowData.forEach(function(item, index){
        JsonArray.push(createDataArray(false, item.id, (item.leadable && item.leadable.contact) ? item.leadable.contact.id+'-'+item.leadable.contact.first_name+' '+item.leadable.contact.last_name : '', (item.creator && item.creator.contact) ? item.creator.contact.id+'-'+item.creator.contact.first_name+' '+item.creator.contact.last_name : '', (item.creator.contact && item.creator.contact.company) ? item.creator.contact.company.id+'-'+item.creator.contact.company.name : '', item.lead_status, moment(item.created_at).format('DD/MM/YYYY'), item.is_active,false));
      });
    }
    return JsonArray;
}

const ActionsDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      ref={ref}
      onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
      id="kt_dashboard_daterangepicker"
      className="btn btn-sm btn-clean btn-icon btn-icon-md"
    >
      {" "}
      <i className="la la-ellipsis-h"></i>
    </a>
));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRowsData] = React.useState([]);
  const [count, setCount] = React.useState(0); // set counter for onload functions
  const [show, setModalDisplay] = React.useState(false); // set modal to show/hide
  const [userIndex, setUser] = React.useState(0); //selected user to perform actions
  const [action, setAction] = React.useState({}); // selected action
  const [temp, setTemp] = React.useState([]); // selected action
  const [isSelectedMany, setSelectedMany] = React.useState(false);
  const [open, setOpen] = React.useState(false); // show/hide Snackbar
  const [message, setMessage] = React.useState('Changes applied successfully!'); // set Message

  const [permission, setPermission] = React.useState({
    create : userHasPermission('add_ableads'),
    edit : userHasPermission('change_ableads'),
    delete : userHasPermission('delete_ableads'),
    view : userHasPermission('view_ableads'),
  });
  let history = useHistory();
  let type = props.match.params.type;
  //  call some function only on page load
  window.table = $('#leads');
  onInitialLoad();
  function onInitialLoad() {
    if(count === 0) {
      getLeads(null);
      setCount(count+1);
    }
  }

  React.useEffect(() => {
      if ( $.fn.dataTable.isDataTable( '#leads' ) ) {
          updateTable(parseRowData(rows), type);
      }
      else {
        let columnDefs = [
                { "bVisible": false, "aTargets": [1] },
                {
                  targets: 0,
                  width: '30px',
                  orderable: false,
                  "createdCell": function (td, cellData, rowData, row, col) {
                    ReactDOM.render(
                                    <Checkbox
                                      checked={isSelected(rowData[1])}
                                      onChange={event => handleClick(event, rowData[1])}
                                      inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row}` }}
                                    />
                                , td
                                );
                  },
                },
                {
                  targets: 2,
                  "createdCell": function (td, cellData, rowData, row, col) {
                      let leadable = '';
                      let leadableID = '';
                      if( rowData[2].includes('-') ) {
                          let leadId = rowData[2].split("-");
                          leadableID = leadId[0];
                          leadable = leadId[1];
                      }else {
                          leadable = rowData[2];
                      }
                    ReactDOM.render(
                        <a target="_blank" style={{ cursor: 'pointer' }} href={"/admin/contacts/"+leadableID}>
                            {leadable}
                          </a>
                        , td
                    );
                  }
                },
                {
                  targets: 3,
                  "createdCell": function (td, cellData, rowData, row, col) {
                      let creator = '';
                      let creatorID = '';
                      if( rowData[3].includes('-') ) {
                          let creatorData = rowData[3].split("-");
                          creatorID = creatorData[0];
                          creator = creatorData[1];
                      }else {
                          creator = rowData[3];
                      }
                    ReactDOM.render(
                        <a target="_blank" style={{ cursor: 'pointer' }} href={"/admin/contacts/"+creatorID }>
                            {creator}
                          </a>
                        , td
                    );
                  }
                },
                {
                  targets: 4,
                  title: 'Company',
                  orderable: true,
                  "createdCell": function (td, cellData, rowData, row, col) {
                      let company = '';
                      let companyID = '';
                      if( rowData[4].includes('-') ) {
                          let companyData = rowData[4].split("-");
                          companyID = companyData[0];
                          company = companyData[1];
                      }else {
                          company = rowData[4];
                      }
                    ReactDOM.render(
                        <a target="_blank" style={{ cursor: 'pointer' }} href={"/admin/companies/"+companyID }>
                            {company}
                          </a>
                        , td
                    );
                  }
                },
              ];
          if(permission.create || permission.edit) {
            columnDefs.push(
                {
                  targets: 7,
                  title: 'Actions',
                  orderable: false,
                  "createdCell": function (td, cellData, rowData, row, col) {
                      ReactDOM.render(
                          <Dropdown className="kt-header__topbar-item" drop="down" alignLeft>
                              <Dropdown.Toggle as={ActionsDropdownToggle} />
                                  <Dropdown.Menu  className="dropdown-menu-fit dropdown-menu-anim dropdown-menu-top-unround">
                                    {permission.edit ? <Dropdown.Item onClick={(e) => handleModalShow(e, row, 'detail') }><i className="flaticon-eye"></i> View Details</Dropdown.Item>:''}
                                    {permission.delete ? <Dropdown.Item onClick={(e) => handleModalShow(e, row, 'delete')}><i className="flaticon2-trash"></i> Remove</Dropdown.Item>:''}
                                  </Dropdown.Menu>
                          </Dropdown>
                          , td
                      );
                    }
                },);
          }
          window.table.DataTable({
            responsive: {
                details: {
                    renderer: $.fn.dataTable.Responsive.renderer.listHiddenNodes()
                }
            },
             data: parseRowData(rows),

            // DOM Layout settings
            dom: `<'row'<'col-sm-12'tr>>
           <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,

            lengthMenu: [5, 10, 25, 50],

            pageLength: 10,
            pagingType: 'numbers',

            language: {
                'lengthMenu': 'Display _MENU_',
            },

            // Order settings
            order: [[4, 'desc']],
            columnDefs:columnDefs ,
        });
      }


  });

  function getLeads(search) {
    let filter = {};
    if(search != null)
      filter = {...filter, ...search }

     list('leads', filter).then(function (response) {
      setRowsData(response.data);
    });
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {

    if (event.target.checked) {
        const sel = selected;
      const leadSelecteds = rows.map(n => n.id);
        leadSelecteds.forEach(v => {
         sel.push(v)
       })
      setSelected(sel);
    }else{
        selected.length = 0;
        setSelected(selected);
    }
    if(isSelectedMany)
      setSelectedMany(false);
    else
      setSelectedMany(true);

  }

  function handleClick(event, id) {
    const selectedIndex = selected.indexOf(id);
    let leadsSelected = [];

    const sel =selected;

    if(selectedIndex === -1){
        sel.push(id);
    }else{
        sel.splice(selectedIndex, 1);
    }
    setSelected(sel);
    const newArr = [...temp];
    newArr.push(1);
    setTemp(newArr);
  }

  function handleSearch(event) {
    getLeads({search:event.target.value});
  }

  function handleModalClose(event) {
    setModalDisplay(false);
  }

  function handleModalShow(event, index, act) {
      if(act !== 'detail'){
            setUser(index);
            setAction(act)
            setModalDisplay(true);
      }else{
            setAction(act)
            setModalDisplay(true);
      }
  }

  function confirm(event) {
    if(action == 'status') {
      var data = {'is_active': rows[userIndex].is_active === 1 ? 0:1};
      patch('leads/'+rows[userIndex].id+'/', data).then(function (response) {
        rows[userIndex] = response.data;
        setRowsData(rows);
        setModalDisplay(false);
        setOpen(true);
        const statusType = response.data.is_active === 1 ? 'activated' : 'deactivated';
        setMessage('Record successfully '+statusType);
      })
    } else if(action == 'delete') {
      del('leads/'+rows[userIndex].id+'/').then(function (response) {
        rows.splice(userIndex,1);
        setRowsData(rows);
        setModalDisplay(false);
        setOpen(true);
        setMessage('Record successfully deleted');
      })
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    setOpen(false);
  };

  const isSelected = id => selected.indexOf(id) !== -1;

  return (

    <div className={classes.root}>

      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
        <div className="kt-portlet kt-portlet--mobile">
            <EnhancedTableToolbar setTemp={setTemp} setRowsData={setRowsData} rows={rows} setSelectedMany={setSelectedMany} setSelected={setSelected} selected={selected} numSelected={selected.length} />
          <div className="kt-portlet__body">

          {permission.view ?
            <div className="kt-form kt-form--label-right kt-margin-t-20 kt-margin-b-10">
              <div className="row align-items-center">
                <div className="col-xl-12 order-2 order-xl-1">
                  <div className="row align-items-center">
                    <div className="col-md-4 kt-margin-b-20-tablet-and-mobile">
                      <div className="kt-input-icon kt-input-icon--left">
                        <input onKeyUp={handleSearch}  type="text" className="form-control" placeholder="Search..." id="generalSearch" />
                        <span className="kt-input-icon__icon kt-input-icon__icon--left">
                          <span><i className="la la-search" /></span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          : ''}
          {permission.view ?
            <div className="kt-section">
                <div>
                  <table className="table table-striped- table-bordered table-hover table-checkable" id={"leads"}>
                      <thead>
                      <tr>
                          <th>
                              <Checkbox
                                checked={isSelectedMany}
                                onChange = {handleSelectAllClick}
                                inputProps={{
                                  'aria-label': 'primary checkbox',
                                }}
                              />
                          </th>
                          <th>ID</th>
                          <th>Lead Title</th>
                          <th>Contact</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                      </tr>
                      </thead>
                  </table>
                </div>
            </div>
            :
            <Notice icon="flaticon-warning kt-font-primary">
            Looks like that you don't have sufficient permission
            </Notice>
          }
          </div>
        </div>
        </div>
      </Paper>
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
            {action !== 'detail' ?
                <Modal.Title>Confirm</Modal.Title>
                :
                <Modal.Title>Lead Details</Modal.Title>
            }
        </Modal.Header>
          {action === 'detail' ?
              <Modal.Body>
                  {console.log(rows[userIndex])}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <List >
                            <ListItem>
                              <ListItemText
                                primary="Lead Title"
                                secondary={rows[userIndex].leadable ? rows[userIndex].leadable.contact.first_name+' '+rows[userIndex].leadable.contact.last_name: ''}
                              />
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemText
                                primary="Contact"
                                secondary={rows[userIndex].leadable ? rows[userIndex].leadable.contact.first_name+' '+rows[userIndex].leadable.contact.last_name: ''}
                              />
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemText
                                primary="Company"
                                secondary={rows[userIndex].leadable.contact.company ? rows[userIndex].leadable.contact.company.name: ''}
                              />
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemText
                                primary="Status"
                                secondary={rows[userIndex] ? rows[userIndex].lead_status: ''}
                              />
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemText
                                primary="Date"
                                secondary={rows[userIndex] ? moment(rows[userIndex].created_at).format('DD/MM/YYYY'): ''}
                              />
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemText
                                primary="Message"
                                secondary={rows[userIndex] ? rows[userIndex].message: ''}
                              />
                            </ListItem>
                        </List>
                    </Grid>
                  </Grid>
              </Modal.Body>
              :
              {}
          }
          {action !== 'detail' ?
              <Modal.Footer>
                  <Button variant="danger" onClick={confirm}>
                      Yes
                  </Button>
                  <Button variant="success" onClick={handleModalClose}>
                      No
                  </Button>
              </Modal.Footer>
              :
              <Modal.Footer>
                  <Button variant="primary" onClick={handleModalClose}>
                      Close
                  </Button>
              </Modal.Footer>
          }
      </Modal>
      <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          autoHideDuration={1600000}
          onClose={handleCloseSnackbar}
        >
          <SnackbarContentWrapper
            onClose={handleCloseSnackbar}
            variant="success"
            message={message}
          />
      </Snackbar>
    </div>
  );
}
