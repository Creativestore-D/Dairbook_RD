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
    IconButton, Paper, Snackbar, Toolbar, Tooltip, Typography, SnackbarContent
} from '@material-ui/core';
import { list, del, USER_URL} from "../../crud/api";
import {Dropdown, Modal, Button} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";
import {ReactComponent as SortNum1Icon} from "../../../_metronic/layout/assets/layout-svg-icons/SortNum1.svg";


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

function createDataArray(  id, name, action ) {
  return [ id, name, action];
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
                   Connection
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
    const table = $('#connections').DataTable();
    table.clear();
    table.rows.add(newData);
    table.draw();
}

function parseRowData(rowData) {
    const JsonArray = [];

    if( Array.isArray(rowData) && rowData.length > 0){
      rowData.forEach(function(item, index){
        JsonArray.push(createDataArray( item.id, item.likeable.id ? item.likeable.first_name+' '+item.likeable.last_name : ' --- ' ,false));
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
  window.table = $('#connections');
  onInitialLoad();
  function onInitialLoad() {
    if(count === 0) {
      getConnections(null);
      setCount(count+1);
    }
  }

  React.useEffect(() => {
      if ( $.fn.dataTable.isDataTable( '#connections' ) ) {
          updateTable(parseRowData(rows), type);
      }
      else {
        let columnDefs = [
                { "bVisible": false, "aTargets": [0] },
                {
                  targets: 1,
                  "createdCell": function (td, cellData, rowData, row, col) {
                    ReactDOM.render(
                          cellData
                        , td
                    );
                  }
                },
              ];
            columnDefs.push(
                {
                  targets: 2,
                  title: 'Actions',
                  orderable: false,
                  "createdCell": function (td, cellData, rowData, row, col) {
                      ReactDOM.render(
                          <>
                          <IconButton aria-label="Delete" onClick={(e) => handleModalShow(e, row, 'delete')}>
                            <DeleteIcon />
                          </IconButton>
                              </>
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
            order: [[2, 'desc']],
            columnDefs:columnDefs ,
        });
      }


  });

  function getConnections(search) {
    let filter = {type: 'connections'};
    if(search != null)
      filter = {...filter, ...search }

     list('likes', filter).then(function (response) {
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
    getConnections({search:event.target.value});
  }

  function handleModalClose(event) {
    setModalDisplay(false);
  }

  function handleModalShow(event, index, act) {
      setAction(act)
      setModalDisplay(true);
  }

  function confirm(event) {
      del('likes/'+rows[userIndex].id+'/').then(function (response) {
        rows.splice(userIndex,1);
        setRowsData(rows);
        setModalDisplay(false);
        setOpen(true);
        setMessage('Record successfully deleted');
      })
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
                  <table className="table table-striped- table-bordered table-hover table-checkable" id={"connections"}>
                      <thead>
                      <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Action</th>
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
