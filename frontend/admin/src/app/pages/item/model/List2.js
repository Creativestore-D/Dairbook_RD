import React from 'react';
import ReactDOM from 'react-dom'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { list, patch, del, API_URL, headers } from "../../../crud/api";
import {Button, Modal } from "react-bootstrap";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";

function createDataArray(id, name, type, status, action ) {
  return [id, name, type, status, action ];
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'action', numeric: true, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
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
  const { numSelected } = props;

  return (<div></div>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
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
}));

const $ = require('jquery');
$.DataTable = require('datatables.net-responsive-bs4');

function updateTable(newData, type) {
    const table = $('#'+type+'_models').DataTable();
    table.ajax.reload(null, false); // if data is loaded using ajax
}

function parseRowData(rowData) {
  if( Array.isArray(rowData) && rowData.length > 0){
    rowData.forEach(function(item, index){
      rowData[index].type_0__name = item._type.name;
      rowData[index]['actions'] = '';
    });
  }
  return rowData;
}

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef();

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
window.prevRows = [];
export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRowsData] = React.useState([]);
  const [count, setCount] = React.useState(0); // set counter for onload functions
  const [show, setModalDisplay] = React.useState(false); // set modal to show/hide
  const [userIndex, setUser] = React.useState(0); //selected user to perform actions
  const [action, setAction] = React.useState({}); // selected action
  const [table, setTable] = React.useState(false); // selected action
  let type = props.match.params.type;
  let history = useHistory();
  window.table = $('#'+type+'_models');
  //  call some function only on page load
  React.useEffect(() => {
    if (  $.fn.dataTable.isDataTable( '#'+type+'_models' ) ) {

        if(JSON.stringify(rows) !== JSON.stringify(window.prevRows)){
          window.prevRows = rows;
          updateTable(parseRowData(rows), type);
        }
    } else {
      loadDatatable();
      setTable(true);
    }
  });

  function loadDatatable() {
    let url = API_URL+'model?type=aircraft&format=datatables';
    

    window.table.DataTable({
      responsive: true,
      // data: parseRowData(rows),
      serverSide:true,
      ajax: {
        url:url ,
        method: "GET",
        headers: headers,
        "dataFilter": function(data) {
            let json = JSON.parse(data);
            setRowsData(json.data);
            json.data = parseRowData(json.data);
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
      order: [[1, 'desc']],
     
      columnDefs: [
        { "bVisible": false, "aTargets": [0] },
        {
          targets: -2,
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
        {
          targets: -1,
          title: 'Actions',
          orderable: false,
          searchable: false,
          "createdCell": function (td, cellData, rowData, row, col) {
              ReactDOM.render(
                <span><a style={{ cursor: 'pointer' }}  className="btn btn-sm btn-clean btn-icon btn-icon-sm"
                    onClick={() => history.push("/"+type+"/model/"+rowData[0]+"/edit") }>
                    <i className="flaticon2-edit"></i>
                  </a>
                  &nbsp;&nbsp;
                  <a title="Delete" onClick={(e) => handleModalShow(e, row, 'delete')} className="btn btn-sm btn-clean btn-icon btn-icon-sm">
                    <i className="flaticon2-trash"></i>
                    </a></span>, td
              );
            }
        },
      ],
      });
    }


  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
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

    const table = $('#'+type+'_models').DataTable();
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
      patch('model/'+rows[userIndex].id+'/', data).then(function (response) {
        rows[userIndex] = response.data;
        setRowsData(rows);
        setModalDisplay(false);
      })
    } else if(action == 'delete') {
      del('model/'+rows[userIndex].id+'/').then(function (response) {
        rows.splice(userIndex,1);
        setRowsData(rows);
        setModalDisplay(false);
      })
    }
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (

    <div className={classes.root}>

      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>



        <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
            <div className="kt-portlet__head-label">
              <span className="kt-portlet__head-icon">
                <i className="kt-font-brand flaticon2-line-chart" />
              </span>
              <h3 className="kt-portlet__head-title">
               {type.charAt(0).toUpperCase() + type.slice(1)} Models
              </h3>
            </div>
            <div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                    <Link to={"/"+type+"/model/create"} className="btn btn-primary btn-icon-sm">
                        <i className="flaticon2-plus"></i>
                        Add
                    </Link>
                    &nbsp;&nbsp;
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="kt-portlet__body">
            {/*begin: Search Form */}
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
            {/*end: Search Form */}


            <div className="kt-section">
                <div>
                  <table className="table table-striped- table-bordered table-hover table-checkable" id={type+"_models"}>
                      <thead>
                      <tr>
                          <th data-data="id">Id</th>
                          <th data-data="name">Name</th>
                          <th data-data="type_0__name">Type</th>
                          <th data-data="is_active">Status</th>
                          <th data-data="actions">Actions</th>
                      </tr>
                      </thead>
                  </table>
                </div>
            </div>
          </div>
        </div>
        </div>
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
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
    </div>
  );
}
