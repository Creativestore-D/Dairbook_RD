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
    IconButton, Paper, FormControlLabel, Switch, Snackbar, Checkbox, Toolbar, Tooltip, Typography, SnackbarContent
} from '@material-ui/core';
import { list, patch, del, userHasPermission, API_URL, headers, importData} from "../../../crud/api";
import {Button, Dropdown, Modal} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";
import {Link} from "react-router-dom";
import Notice from "../../../partials/content/Notice";
import { CSVLink } from "react-csv";
import {ReactComponent as SortNum1Icon} from "../../../../_metronic/layout/assets/layout-svg-icons/SortNum1.svg";
import CSVReader from 'react-csv-reader';
import { setPageNum, getPageNum } from "../../../helpers/listing";

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
  const { setMessageType, setMessage, setOpen, exportSpinner,setExpSpin, csvData, setCsvData, numSelected, type, selected, setSelected, setSelectedMany, setRowsData, rows, setTemp } = props;
  function handleDelAll(event) {
    if(selected.length) {
      let data = {ids:selected}
      del('category/'+selected[0]+'/', data).then(function (response) {
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

        updateTable(type);
      })
    }
  }

  function fetchCSVData() {
    setExpSpin('');
    list('category', {records:'all', type:type}).then(response => {
      setExpSpin('d-none');
      setCsvData(response.data);
      document.getElementById('category-csv-btn').click();
    })
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
                { type && (type === 'event' || type === 'news')  ? (
                    <i className="kt-font-brand flaticon2-open-box" />
                ) : (
                    <i className="kt-font-brand flaticon2-start-up" />
                    )
                }
              </span>
                {numSelected > 0 ? (
                  <Typography color="inherit" variant="subtitle1">
                    {numSelected} selected
                  </Typography>
                ) : (
                  <h3 className="kt-portlet__head-title">
                   {type.charAt(0).toUpperCase() + type.slice(1)} Categories
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
                            <Link to={"/admin/"+type+"/category/create"} className="btn btn-sm btn-brand btn-elevate btn-icon-sm new-record">
                                <i className="la la-plus"></i>
                                New Record
                            </Link>
                              <Dropdown className="dropdown-inline" drop="down" alignRight>
                                <Dropdown.Toggle as={QuickActionsDropdownToggle}
                                  id="dropdown-toggle-quick-actions-subheader"
                                />

                                <Dropdown.Menu className="dropdown-menu-fit dropdown-menu-md dropdown-menu-right">
                                  <ul className="kt-nav">
                                    <li className="kt-nav__item">
                                      <a onClick={fetchCSVData} className="kt-nav__link">
                                        <i className="kt-nav__link-icon la la-upload" />
                                        <span className="kt-nav__link-text">Export</span>
                                         <div className={'spinner-grow '+exportSpinner}></div>
                                      </a>
                                      <CSVLink
                                        data={csvData}
                                        filename="categories.csv"
                                        className="d-none"
                                        id="category-csv-btn"
                                        target="_blank"
                                     />
                                    </li>
                                    <li className="kt-nav__item">
                                      <a className="kt-nav__link">
                                        <i className="kt-nav__link-icon la la-upload" />
                                        <CSVReader inputId="category-csv-reader" cssClass="kt-nav__link-text" cssInputClass="d-none" label="Import" onFileLoaded={data => importData(data, 'AbCategories').then((response)=>{
                                          if(response.data.success)
                                            setMessageType('success');
                                          else
                                            setMessageType('error');
                                          
                                            setMessage(response.data.message);
                                            setOpen(true);
                                            updateTable()
                                          })
                                          } />
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

function updateTable(type) {
    const table = $('#'+type+'_category').DataTable();
    table.ajax.reload(null, false);
}

function parseRowData(rowData) {
    if( Array.isArray(rowData) && rowData.length > 0){
    rowData.forEach(function(item, index){
      rowData[index]['actions'] = rowData[index]['checkbox'] = '';
    });
  }
  return rowData;
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
  console.log('component props ...', props);
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
  const [csvData, setCsvData] = React.useState([]); // selected action
  const [table, setTable] = React.useState(false); // selected action
  const [exportSpinner, setExpSpin] = React.useState('d-none');
  const [messageType, setMessageType] = React.useState('success');
  const [permission, setPermission] = React.useState({
    create : userHasPermission('add_abcategories'),
    edit : userHasPermission('change_abcategories'),
    delete : userHasPermission('delete_abcategories'),
    view : userHasPermission('view_abcategories'),
  });
  let history = useHistory();
  let type = props.match.params.type;
  //  call some function only on page load

  React.useEffect(() => {
    if(props.location){ 
      console.log(props.location);
    }
   console.log('property changed', props.location);
  },[props.location])

/*  React.useEffect(() => {
    if($.fn.dataTable.isDataTable( '#'+type+'_category' )) {
        let table = $('#'+type+'_category').DataTable();
        table.destroy();
        setTable(true);
      }
  });*/

  React.useEffect(() => {
    if (table && $.fn.dataTable.isDataTable( '#'+type+'_category' ) ) {
      if(JSON.stringify(rows) !== JSON.stringify(window.prevRows)){
        window.prevRows = rows;
      }
    } else {
      setTable(true);
      try {
        loadDatatable();
      } catch(e) {
        console.log('ignore - dt destroy');
      }
    }
  }, [rows]);

  function loadDatatable() {
    let url = API_URL+'category?type='+type+'&format=datatables';
    let columnDefs = [
      { "bVisible": false, "aTargets": [1] },
      { "bVisible": false, "aTargets": [5] },
      {
        targets: 0,
        width: '30px',
        orderable: false,
        searchable: false,
        "createdCell": function (td, cellData, rowData, row, col) {
          ReactDOM.render(
                          <Checkbox
                            checked={isSelected(rowData.id)}
                            onChange={event => handleClick(event, rowData.id)}
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
              <a style={{ cursor: 'pointer' }} onClick={() => history.push("/admin/"+type+"/category/"+rowData.id) }>
                  {cellData}
                </a>
              , td
          );
        }
      },
      {
        targets: 3,
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
    if(permission.create || permission.edit) {
      columnDefs.push(
          {
            targets: 4,
            title: 'Actions',
            orderable: false,
            searchable: false,
            "createdCell": function (td, cellData, rowData, row, col) {
                ReactDOM.render(
                    <Dropdown className="kt-header__topbar-item" drop="down" alignLeft>
                        <Dropdown.Toggle as={ActionsDropdownToggle} />
                            <Dropdown.Menu  className="dropdown-menu-fit dropdown-menu-anim dropdown-menu-top-unround">
                              {permission.edit ? <Dropdown.Item onClick={() => history.push("/admin/"+type+"/category/"+rowData.id+"/edit") }><i className="flaticon2-edit"></i> Edit Details</Dropdown.Item>:''}
                              {permission.delete ? <Dropdown.Item onClick={(e) => handleModalShow(e, row, 'delete')}><i className="flaticon2-trash"></i> Remove</Dropdown.Item>:''}
                            </Dropdown.Menu>
                    </Dropdown>
                    , td
                );
              }
          },);
    }
    $('#'+type+'_category').DataTable({
      responsive: {
          details: {
              renderer: $.fn.dataTable.Responsive.renderer.listHiddenNodes()
          }
      },
      serverSide:true,
      aoSearchCols: [
        null,
        null,
        null,
        null,
        null,
        { "sSearch": type },
      ],
      displayStart : getPageNum(type+'_category', props),
      ajax: {
        url:url ,
        method: "GET",
        headers: {'Content-Type': 'application/json', 'Authorization': 'Token '+JSON.parse(localStorage.getItem('persist:demo1-auth')).authToken.replace(/['"]+/g, '')},
        "dataFilter": function(data) {
            let json = JSON.parse(data);
            let rowData = parseRowData(json.data);
            setRowsData(rowData);
            json.data = rowData;
            return JSON.stringify(json); // return JSON string
        },
      },

      // DOM Layout settings
      dom: `<'row'<'col-sm-12'tr>>
     <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,

      lengthMenu: [5, 10, 25, 50],

      pageLength: 10,
      pagingType: 'numbers',
      recordsTotal: rows.recordsTotal, // The number in my test data set
      recordsFiltered: rows.recordsFiltered,

      language: {
          'lengthMenu': 'Display _MENU_',
      },

      // Order settings
      order: [[4, 'desc']],
      columnDefs:columnDefs ,
    });


    $('#'+type+'_category').on( 'page.dt', function () {
        setPageNum($('#'+type+'_category'), type+'_category', props);
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

    updateTable(type);

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
    updateTable(type);
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
    const table = $('#'+type+'_category').DataTable();
    table.search( event.target.value ).draw();
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
      var data = {'is_active': rows[userIndex].is_active === 1 ? 0:1};
      patch('category/'+rows[userIndex].id+'/', data).then(function (response) {
        let rowsData = rows.filter((v,i) => i !== userIndex);
        setRowsData([...rowsData, response.data]);
        setModalDisplay(false);
        updateTable(type);
        setOpen(true);
        const statusType = response.data.is_active === 1 ? 'activated' : 'deactivated';
        setMessageType('success');
        setMessage('Record successfully '+statusType);
      })
    } else if(action == 'delete') {
      del('category/'+rows[userIndex].id+'/').then(function (response) {
        let rowsData = rows.filter((v,i) => i !== userIndex);
        setRowsData(rowsData);
        setModalDisplay(false);
        updateTable(type);
        setOpen(true);
        setMessageType('success');
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
            <EnhancedTableToolbar setMessageType={setMessageType} setMessage={setMessage} setOpen={setOpen} exportSpinner={exportSpinner} setExpSpin={setExpSpin}  csvData={csvData} setCsvData={setCsvData} setTemp={setTemp} setRowsData={setRowsData} rows={rows} setSelectedMany={setSelectedMany} setSelected={setSelected} selected={selected} numSelected={selected.length} type={type} />
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
                  <table className="table table-striped- table-bordered table-hover table-checkable" id={type+"_category"}>
                      <thead>
                      <tr>
                          <th data-data="checkbox">
                              <Checkbox
                                checked={isSelectedMany}
                                onChange = {handleSelectAllClick}
                                inputProps={{
                                  'aria-label': 'primary checkbox',
                                }}
                              />
                          </th>
                          <th data-data="id">ID</th>
                          <th data-data="name">Name</th>
                          <th data-data="is_active">Status</th>
                          <th data-data="actions">Actions</th>
                          <th data-data="type" className="d-none">Type</th>
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
            autoHideDuration={1500}
            onClose={handleCloseSnackbar}
          >
            <SnackbarContentWrapper
              onClose={handleCloseSnackbar}
              variant={messageType}
              message={message}
            />
        </Snackbar>
    </div>
  );
}
