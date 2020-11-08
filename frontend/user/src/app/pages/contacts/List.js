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
    IconButton, Paper, Snackbar, Checkbox, Toolbar, Tooltip, Typography, SnackbarContent
} from '@material-ui/core';
import { list, patch, del} from "../../crud/api";
import {Button, Dropdown, Modal} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";
import {Link} from "react-router-dom";


function createDataArray(checkbox, id, name, job_title, company, status, action ) {
  return [checkbox, id, name, job_title, company, status, action ];
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
      del('contacts/'+selected[0]+'/', data).then(function (response) {
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
                   Contacts
                  </h3>
                )}
            </div>
            <div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                      {numSelected > 0 ? (
                          <Tooltip title="Delete">
                            <IconButton onClick={(e) => handleDelAll(e)} aria-label="Delete">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                      ) : (
                            <Link to={"/admin/contacts/create"} className="btn btn-sm btn-brand btn-elevate btn-icon-sm">
                                <i className="la la-plus"></i>
                                New Record
                            </Link>
                      )}
                  </div>
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
    marginTop: theme.spacing(3),
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
    const table = $('#contacts').DataTable();
    table.clear();
    table.rows.add(newData);
    table.draw();
}

function parseRowData(rowData) {
    const JsonArray = [];
    if( Array.isArray(rowData) && rowData.length > 0){
      rowData.forEach(function(item, index){
          JsonArray.push(createDataArray(false, item.id, item.first_name+' '+item.last_name, item.job_title ? item.job_title.name : '', item.company ? item.company.name : '', item.is_published,false));
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

  let history = useHistory();
  let type = props.match.params.type;
  //  call some function only on page load
  window.table = $('#contacts');
  onInitialLoad();
  function onInitialLoad() {
    if(count === 0) {
      getContacts(null);
      setCount(count+1);
    }
  }

  React.useEffect(() => {
      if ( $.fn.dataTable.isDataTable( '#contacts' ) ) {
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
                    ReactDOM.render(
                        <a style={{ cursor: 'pointer' }} onClick={() => history.push("/admin/contacts/"+rowData[1]) }>
                            {cellData}
                          </a>
                        , td
                    );
                  }
                },
                {
                  targets: 5,
                  title: 'Status',
                  orderable: false,
                  "createdCell": function (td, cellData, rowData, row, col) {
                    ReactDOM.render(
                        <span onClick={(e) => handleModalShow(e, row, 'status')} className={cellData === 1 ? 'kt-switch kt-switch--sm kt-switch--success':'kt-switch kt-switch--sm kt-switch--danger'}>
                        <label>
                          <input
                            type="checkbox" checked={cellData === 1 ? 'defaultChecked':''}
                            name="quick_panel_notifications_1"
                          />
                          <span />
                        </label>
                      </span>, td
                    );
                  }
                },
              ];
            columnDefs.push(
                {
                  targets: 6,
                  title: 'Actions',
                  orderable: false,
                  "createdCell": function (td, cellData, rowData, row, col) {
                      ReactDOM.render(
                          <Dropdown className="kt-header__topbar-item" drop="down" alignLeft>
                              <Dropdown.Toggle as={ActionsDropdownToggle} />
                                  <Dropdown.Menu  className="dropdown-menu-fit dropdown-menu-anim dropdown-menu-top-unround">
                                    <Dropdown.Item onClick={() => history.push("/admin/contacts/"+rowData[1]+"/edit") }><i className="flaticon2-edit"></i> Edit Details</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => handleModalShow(e, row, 'delete')}><i className="flaticon2-trash"></i> Remove</Dropdown.Item>
                                  </Dropdown.Menu>
                          </Dropdown>
                          , td
                      );
                    }
                },);
          
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
            order: [],
            columnDefs:columnDefs ,
        });
      }


  });

  function getContacts(search) {
    let filter = {'type':type};
    if(search != null)
      filter = {...filter, ...search }

     list('contacts', filter).then(function (response) {
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
      const newSelecteds = rows.map(n => n.id);
        newSelecteds.forEach(v => {
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
    let newSelected = [];

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

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  function handleSearch(event) {
    getContacts({search:event.target.value});
  }

  function handleModalClose(event) {
    setModalDisplay(false);
  }

  function handleModalShow(event, index, act) {
    setUser(index);
    setAction(act)
    setModalDisplay(true);
  }

  function confirm(event) {
    if(action == 'status') {
      var data = {'is_published': rows[userIndex].is_published === 1 ? 0:1};
      patch('contacts/'+rows[userIndex].id+'/', data).then(function (response) {
        rows[userIndex] = response.data;
        setRowsData(rows);
        setModalDisplay(false);
        setOpen(true);
        const statusType = response.data.is_published === 1 ? 'activated' : 'deactivated';
        setMessage('Record successfully '+statusType);
      })
    } else if(action == 'delete') {
      del('contacts/'+rows[userIndex].id+'/').then(function (response) {
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
            <EnhancedTableToolbar setTemp={setTemp} setRowsData={setRowsData} rows={rows} setSelectedMany={setSelectedMany} setSelected={setSelected} selected={selected} numSelected={selected.length} type={type} />
          <div className="kt-portlet__body">

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
 
            <div className="kt-section">
                <div>
                  <table className="table table-striped- table-bordered table-hover table-checkable" id={"contacts"}>
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
                          <th>Name</th>
                          <th>Job Title</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Actions</th>
                      </tr>
                      </thead>
                  </table>
                </div>
            </div>
          </div>
        </div>
        </div>
      </Paper>
        <Modal show={show} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="danger" onClick={confirm}>
              Yes
            </Button>
            <Button variant="success" onClick={handleModalClose}>
              No
            </Button>
          </Modal.Footer>
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
