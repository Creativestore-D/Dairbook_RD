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
import { list, patch, del, PERMISSIONS, userHasPermission, API_URL } from "../../../crud/api";
import {Button, Modal, Badge, Dropdown } from "react-bootstrap";
import { Link, withRouter, BrowserRouter } from 'react-router-dom';
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";
import { useHistory } from "react-router-dom";
import Notice from "../../../partials/content/Notice";
import { CSVLink } from "react-csv";
import {ReactComponent as SortNum1Icon} from "../../../../_metronic/layout/assets/layout-svg-icons/SortNum1.svg";
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

// function createDataArray(id, name, role, permissions, status, actions ) {
//   return [id, name, role, permissions, status, actions];
// }

// function desc(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function stableSort(array, cmp) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = cmp(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map(el => el[0]);
// }

// function getSorting(order, orderBy) {
//   return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
// }

// const headRows = [
//   { id: 'id', numeric: false, disablePadding: false, label: 'Id'},
//   { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
//   { id: 'role', numeric: false, disablePadding: true, label: 'Role' },
//   { id: 'permission', numeric: false, disablePadding: false, label: 'Permissions' },
//   { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
//   { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
// ];

// function EnhancedTableHead(props) {
//   const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
//   const createSortHandler = property => event => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow className="">
//         {headRows.map(row => (
//           <TableCell
//            className=""
//             key={row.id}
//             align={row.numeric ? 'right' : 'left'}
//             padding={row.disablePadding ? 'none' : 'default'}
//             sortDirection={orderBy === row.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === row.id}
//               direction={order}
//               onClick={createSortHandler(row.id)}
//             >
//               {row.label}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

// EnhancedTableHead.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.string.isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

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
    const table = $('#admin_user_table').DataTable();
    table.ajax.reload(null, false);
}

function parseRowData(rowData) {
  if( Array.isArray(rowData) && rowData.length > 0){
    rowData.forEach(function(item, index){
      if(item.contact)
          rowData[index]['contact__first_name'] = item.contact.first_name+' '+item.contact.last_name;
      else
          rowData[index]['contact__first_name'] = '';
      if(item.group_name)
          rowData[index]['groups__name'] = item.group_name;
      else
          rowData[index]['groups__name'] = '';

    rowData[index]['actions'] = rowData[index]['checkbox'] = '';
  });
}
return rowData;
}

function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rows, setRowsData] = React.useState([]);
  const [count, setCount] = React.useState(0); // set counter for onload functions
  const [show, setModalDisplay] = React.useState(false); // set modal to show/hide
  const [userIndex, setUser] = React.useState(0); //selected user to perform actions
  const [action, setAction] = React.useState({}); // selected action
  const [csvData, setCsvData] = React.useState([]); // selected action
  const [table, setTable] = React.useState(false); // selected action
  const [permission, setPermission] = React.useState({
    create : userHasPermission('add_abusers'),
    edit : userHasPermission('change_abusers'),
    delete : userHasPermission('delete_abusers'),
    view : userHasPermission('view_abusers'),
  });
  let history = useHistory();

  React.useEffect(() => {
    if($.fn.dataTable.isDataTable( '#admin_user_table' )) {
    let table = $('#admin_user_table').DataTable();
    table.destroy();
    setTable(true);
    }
  }, []);

  React.useEffect(() => {
      if ( table && $.fn.dataTable.isDataTable( '#admin_user_table' ) ) {
        if(JSON.stringify(rows) !== JSON.stringify(window.prevRows)){
          window.prevRows = rows;
        }
      } else {
        setTable(true);
        loadDatatable();
      }
    }, [rows]);
    function loadDatatable() {
      let url = API_URL+'users?format=datatables&not_group=user';
      let columnDefs = [
        { "bVisible": false, "aTargets": [0] },
        {
          targets: 3,
          orderable: false,
          searchable:false,
          "createdCell": function (td, cellData, rowData, row, col) {
            ReactDOM.render(
                <a onClick={() => history.push("/admin/admin-user/"+rowData.id+"/permissions") }>
                <Badge variant="primary">{cellData ? cellData+' Permissions':'No Permission'} </Badge>
                </a>, td
            );
          }
        },
        {
          targets: 4,
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
          targets: -1,
          orderable: false,
          searchable:false,
          "createdCell": function (td, cellData, rowData, row, col) {
               ReactDOM.render(
                <span>
                {permission.edit ? <a style={{ cursor: 'pointer' }}  className="btn btn-sm btn-clean btn-icon btn-icon-sm"
                  onClick={() => history.push("/admin/admin-user/"+rowData.id+"/edit") }>
                  <i className="flaticon2-edit"></i>
                </a>:''}
                &nbsp;&nbsp;
                {permission.delete ? <a title="Delete" onClick={(e) => handleModalShow(e, row, 'delete')} className="btn btn-sm btn-clean btn-icon btn-icon-sm">
                        <i className="flaticon2-trash"></i>
                        </a> : ''}</span>, td)
          }
        });
      }
      $('#admin_user_table').DataTable({
        responsive: {
          details: {
            renderer: $.fn.dataTable.Responsive.renderer.listHiddenNodes()
          }
        },
        serverSide:true,
        displayStart : getPageNum('users', props),
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
        order: [[1, 'desc']],
        columnDefs:columnDefs ,
      });
      $('#admin_user_table').on( 'page.dt', function () {
        setPageNum($('#admin_user_table'), 'users', props);
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
    updateTable();
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
    updateTable();
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
    const table = $('#admin_user_table').DataTable();
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
      patch('users/'+rows[userIndex].id+'/', data).then(function (response) {
        let rowsData = rows.filter((v,i) => i !== userIndex);
        setRowsData([...rowsData, response.data]);
          updateTable();
        setModalDisplay(false);
      })
    } else if(action == 'delete') {
      del('users/'+rows[userIndex].id+'/').then(function (response) {
        let rowsData = rows.filter((v,i) => i !== userIndex);
        setRowsData(rows);
        setModalDisplay(false);
          updateTable();
        updateTable();
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
                <i className="kt-font-brand flaticon-security" />
              </span>
              <h3 className="kt-portlet__head-title">
               Admin Users
              </h3>
            </div>
            <div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  {permission.create ?
                   <Link to="/admin/admin-user/create" className="btn btn-sm btn-brand btn-elevate btn-icon-sm new-record">
                        <i className="flaticon2-plus"></i>
                        New Record
                    </Link>: ''}
                 </div>
                </div>
              </div>
            </div>
          </div>
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
            </div> : ''}
          {permission.view ? 
            <div className="kt-section">
                <div>
                  <table className="table table-striped- table-bordered table-hover table-checkable" id="admin_user_table">
                      <thead>
                      <tr>
                          <th data-data="id">ID</th>
                          <th data-data="contact__first_name">Name</th>
                          <th data-data="groups__name">Role</th>
                          <th data-data="user_permissions">Permissions</th>
                          <th data-data="is_active">Status</th>
                          {permission.edit || permission.delete ?
                          <th data-data="actions">Actions</th> : ''}
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
    </div>
  );
}
export default withRouter(EnhancedTable);