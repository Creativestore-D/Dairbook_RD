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
import { list, patch, del, API_URL } from "../../crud/api";
import {Button, Modal, Badge } from "react-bootstrap";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";
import { setPageNum, getPageNum } from "../../helpers/listing";
import {ReactComponent as SortNum1Icon} from "../../../_metronic/layout/assets/layout-svg-icons/SortNum1.svg";
function createDataArray(user_id, user, ip, method, date  ) {
  return [user_id, user, ip, method, date ];
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
    const table = $('#accesslog').DataTable();
		table.ajax.reload(null, false);
}

function parseRowData(rowData) {  
  if( Array.isArray(rowData) && rowData.length > 0){
    rowData.forEach(function(item, index){
      item.payload=JSON.parse(item.payload);
      if(item.user)
        rowData[index]['user__first_name'] = item.user.first_name+' '+item.user.last_name;
      else
      rowData[index]['user__first_name'] = ' ';
      if(item.payload)
        rowData[index]['ip_address'] = item.payload.REMOTE_ADDR;
      else
      rowData[index]['ip_address'] = ' ';
      if(item.payload)
        rowData[index]['payload'] = item.payload.REQUEST_METHOD;
      else
      rowData[index]['payload'] = ' ';
      rowData[index]['actions'] = rowData[index]['checkbox'] = '';
    });
  }
  return rowData;
}

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
  const [csvData, setCsvData] = React.useState([]); // selected action
	const [table, setTable] = React.useState(false); // selected action
  let history = useHistory();
  //  call some function only on page load
  window.table = $('#accesslog');
  onInitialLoad();
  function onInitialLoad() {
    if(count === 0) {
      // getAccesslogs(null);
      setCount(count+1);
    }

  }

  React.useEffect(() => {
		if($.fn.dataTable.isDataTable( '#accesslog' )) {
		let table = $('#accesslog').DataTable();
		table.destroy();
		setTable(true);
		}
  }, []);

  React.useEffect(() => {
    if (table && $.fn.dataTable.isDataTable( '#accesslog' ) ) {
        if(JSON.stringify(rows) !== JSON.stringify(window.prevRows)){
          window.prevRows = rows;
        }
      } else {
        setTable(true);
        loadDatatable();
      }
    }, [rows]);

    function loadDatatable() {
      let url = API_URL+'accesslogs?format=datatables';
      let columnDefs = [
        
        { "aTargets": [0,1,2], searchable:false },
      ];
            $('#accesslog').DataTable({
        responsive: {
          details: {
            renderer: $.fn.dataTable.Responsive.renderer.listHiddenNodes()
          }
        },
        serverSide:true,
        displayStart : getPageNum('accesslogs', props),
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
      });$('#accesslog').on( 'page.dt', function () {
        setPageNum($('#accesslog'), 'accesslogs', props);
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
		const table = $('#accesslog').DataTable();
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
        setModalDisplay(false);
        updateTable();
      })
    } else if(action == 'delete') {
      del('users/'+rows[userIndex].id+'/').then(function (response) {
				let rowsData = rows.filter((v,i) => i !== userIndex);
				setRowsData(rowsData);
        setModalDisplay(false);
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
               Access Logs
              </h3>
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
                  <table className="table table-striped- table-bordered table-hover table-checkable" id="accesslog">
                      <thead>
                      <tr>
                          <th data-data="user_id">User Id</th>
                          <th data-data="user__first_name">User</th>
                          <th data-data="ip_address">IP Address</th>
                          <th data-data="payload">Method</th>
                          <th data-data="created_at">Date</th>
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
    </div>
  );
}
