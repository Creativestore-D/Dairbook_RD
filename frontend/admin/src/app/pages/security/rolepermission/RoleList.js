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
import { list, patch, del, PERMISSIONS } from "../../../crud/api";
import {Button, Modal } from "react-bootstrap";
import { Link, withRouter, BrowserRouter } from 'react-router-dom';
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";
import { useHistory } from "react-router-dom";
import { CSVLink } from "react-csv";


function createDataArray(id, name, role, permissions, actions ) {
  return [id, name, role, permissions, actions];
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
  { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
  { id: 'name', numeric: false, disablePadding: false, label: 'User Name' },
  { id: 'role', numeric: false, disablePadding: true, label: 'Role' },
  { id: 'permission', numeric: false, disablePadding: false, label: 'Permissions' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
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
}));

const $ = require('jquery');
$.DataTable = require('datatables.net-responsive-bs4');

function updateTable(newData) {
    const table = $('#role_perm_table').DataTable();
    table.clear();
    table.rows.add(newData);
    table.draw();
}

function parseRowData(rowData) {
    const JsonArray = [];
    rowData.forEach(function(item, index){
        let permissions = '';
        item.user_permissions.map((val, i) => { 
          permissions += PERMISSIONS[val-1].label+', '
        })
        JsonArray.push(createDataArray(item.id, item.contact.first_name+' '+item.contact.last_name, 'Sub-Admin', permissions,false));
    });
    return JsonArray;
}

function EnhancedTable() {
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
  const [csvData, setCsvData] = React.useState([]); // selected action
  let history = useHistory();
  //  call some function only on page load
  window.table = $('#role_perm_table');
  onInitialLoad();
  function onInitialLoad() {
    if(count === 0) {
      getUsers(null);
      setCount(count+1);
    }

  }

  React.useEffect(() => {
      if ( $.fn.dataTable.isDataTable( '#role_perm_table' ) ) {
          updateTable(parseRowData(rows));
      }
      else {
          window.table.DataTable({
            responsive: true,
             data: parseRowData(rows),

            // DOM Layout settings
            dom: `<'row'<'col-sm-12'tr>>
           <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,

            lengthMenu: [5, 10, 25, 50],

            pageLength: 10,

            language: {
                'lengthMenu': 'Display _MENU_',
            },

            // Order settings
            order: [[1, 'desc']],
            columnDefs: [
            { "bVisible": false, "aTargets": [0] },
            {
              targets: -1,
              orderable: false,
              "createdCell": function (td, cellData, rowData, row, col) {
                   ReactDOM.render(
                    <a style={{ cursor: 'pointer' }}  className="btn btn-sm btn-clean btn-icon btn-icon-sm"
                      onClick={() => history.push("/role-permission/"+rowData[0]+"/edit") }>
                      <i className="flaticon2-edit"></i>
                    </a>, td)
                }
            },
          ],
        });
      }

      
  });


  function getUsers(search) {
    let filter = {'groups__name':'sub-admin'};
    if(search != null)
      filter = {...filter, ...search }

     list('users', filter).then(function (response) {
      setRowsData(response.data);
      if(search == null)
        setCsvData(response.data);

      window.table.on('change', '.kt-group-checkable', function() {
      var set = $(this).closest('table').find('td:first-child .kt-checkable');
      var checked = $(this).is(':checked');

      $(set).each(function() {
        if (checked) {
          $(this).prop('checked', true);
          $(this).closest('tr').addClass('active');
        }
        else {
          $(this).prop('checked', false);
          $(this).closest('tr').removeClass('active');
        }
      });
    });

    window.table.on('change', 'tbody tr .kt-checkbox', function() {
      $(this).parents('tr').toggleClass('active');
    });
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
    getUsers({search:event.target.value});
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
                <i className="kt-font-brand flaticon-security" />
              </span>
              <h3 className="kt-portlet__head-title">
               Roles & Permissions
              </h3>
            </div>
            <div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                    <CSVLink
                          data={csvData}
                          asyncOnClick={true}
                          className="btn btn-default btn-icon-sm"
                          filename="airbookers.csv"
                          onClick={(event, done) => {
                          }}
                        >
                         <i className="la la-download"></i> Export 
                    </CSVLink>
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
                  <table className="table table-striped- table-bordered table-hover table-checkable" id="role_perm_table">
                      <thead>
                      <tr>
                          <th>ID</th>
                          <th>User Name</th>
                          <th>Role</th>
                          <th>Permissions</th>
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
    </div>
  );
}
export default withRouter(EnhancedTable);