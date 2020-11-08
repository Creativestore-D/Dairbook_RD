import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Portlet,
  PortletBody,
  PortletHeader,
} from "../../partials/content/Portlet";
import { metronic } from "../../../_metronic";
import AirBookersChart from "../../charts/AirBookers";
import PendingApprovals from "../../widgets/PendingApprovals";
import {list} from "../../crud/api";
import GenericChart from "../../charts/GenericChart";
import GenericChartHtml from "../../charts/GenericChartHtml";
import {Nav, Tab} from "react-bootstrap";
import {Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";

const useStyles = makeStyles(theme => ({
  title: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
  },
}));

export default function Dashboard() {
    const classes = useStyles();
    const [rows, setRowsData] = React.useState([]);
    const [count, setCount] = React.useState(0); // set counter for onload functions
    const [pendingAssets, setPendingAssets] = React.useState({aircrafts : '', engines: '', apus: '', wanteds: '', parts: '' }); // set pending assets

    const { brandColor, dangerColor, successColor, primaryColor } = useSelector(
        state => ({
      brandColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.brand"
      ),
      dangerColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.danger"
      ),
      successColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.success"
      ),
      primaryColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.primary"
      )
    })
    );

  const chartOptions = useMemo(
    () => ({
      chart1: {
        data: [10, 14, 18, 11, 9, 12, 14, 17, 18, 14],
        color: brandColor,
        border: 3
      },

      chart2: {
        data: [11, 12, 18, 13, 11, 12, 15, 13, 19, 15],
        color: dangerColor,
        border: 3
      },

      chart3: {
        data: [12, 12, 18, 11, 15, 12, 13, 16, 11, 18],
        color: successColor,
        border: 3
      },

      chart4: {
        data: [11, 9, 13, 18, 13, 15, 14, 13, 18, 15],
        color: primaryColor,
        border: 3
      }
    }),
    [brandColor, dangerColor, primaryColor, successColor]
  );

  const rowsTable = [
      createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
      createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
      createData('Eclair', 262, 16.0, 24, 6.0),
      createData('Cupcake', 305, 3.7, 67, 4.3),
      createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

  function createData(name, calories, fat, carbs, protein) {
      return { name, calories, fat, carbs, protein };
    }

  onInitialLoad();
  function onInitialLoad() {
    if(count === 0) {
      getDashboardData();
      getAssetData('aircrafts');
      setCount(count+1);
    }
  }

  function getDashboardData() {
    let filter = {};
     list('admin_dashboard', filter).then(function (response) {
      setRowsData(response.data);
    });
  }

  function getAssetData(type) {
      let filter = {isactivestatus: 'Pending Approval', layout: 'dashboard'};
      list(type, filter).then(function (response) {
          setPendingAssets({
              ...pendingAssets,
              [type] : response.data
          });
      });
  }

  return (
    <>
        <Portlet>
            <PortletBody fit={true}>
              <div className="row row-no-padding row-col-separator-xl">
                <div className="col-xl-4">
                    <Portlet fluidHeight={true}>
                        <PortletHeader
                          title="Airbookers"
                        />
                        <PortletBody>
                          <AirBookersChart data={rows['pieChartData']} />
                        </PortletBody>
                  </Portlet>
                </div>
                <div className="col-xl-8">
                  <Portlet fluidHeight={true}>
                    <PortletHeader
                      title="Pending Approvels"
                      desc="Latest 5 pending approvals"
                      className = "flex-column align-items-start"
                      classNameHeader = "pt-3"
                    />
                    <PortletBody>
                        <Tab.Container id="pending-approvals" defaultActiveKey="aircrafts">
                            <Nav variant="pills">
                              <Nav.Item>
                                <Nav.Link eventKey="aircrafts" onSelect={(e) => getAssetData('aircrafts')}>Aircrafts</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="engines" onSelect={(e) => getAssetData('engines')}>Engines</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="apus" onSelect={(e) => getAssetData('apus')}>APU's</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="wanted" onSelect={(e) => getAssetData('wanteds')}>Wanted</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="parts" onSelect={(e) => getAssetData('parts')}>Parts</Nav.Link>
                              </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="aircrafts">
                                    <PendingApprovals rowData={pendingAssets.aircrafts} type="aircraft" />
                                </Tab.Pane>
                                <Tab.Pane eventKey="engines">
                                    <PendingApprovals rowData={pendingAssets.engines} type="engine" />
                                </Tab.Pane>
                                <Tab.Pane eventKey="apus">
                                    <PendingApprovals rowData={pendingAssets.apus} type="apu" />
                                </Tab.Pane>
                                <Tab.Pane eventKey="wanted">
                                    <PendingApprovals rowData={pendingAssets.wanteds} type="wanted" />
                                </Tab.Pane>
                                <Tab.Pane eventKey="parts">
                                    <PendingApprovals rowData={pendingAssets.parts} type="part" />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                      {/*<NewUsersChart charData={rows['userYearlyData']} />*/}
                    </PortletBody>
                  </Portlet>
                </div>
              </div>
            </PortletBody>
        </Portlet>

        <Portlet>
        <PortletBody fit={true}>
          <div className="row row-no-padding row-col-separator-xl">
            <div className="col-xl-4">
              <GenericChart
                title="Users"
                desc="Number of active and inactive Users"
                rawData={{active:rows['activeUser'],inactive:rows['inActiveUser'], data: rows['userYearlyData']}}
                chartType= "bar"
                color = "#098785"
                step="monthly"
              />
            </div>
            <div className="col-xl-4">
              <GenericChart
                title="Companies"
                desc="Number of active and inactive Companies"
                rawData={{active:rows['activeCompany'],inactive:rows['inActiveCompany'], data: rows['companyYearlyData']}}
                step="monthly"
                chartType= "bar"
              />
            </div>
            <div className="col-xl-4">
              <GenericChart
                title="Contacts"
                desc="Number of active and inactive Contacts"
                rawData={{active:rows['activeContact'],inactive:rows['inActiveContact'], data: rows['contactsYearlyData']}}
                step="monthly"
              />
            </div>
          </div>
        </PortletBody>
      </Portlet>

        <div className="row">
            <div className="col-xl-4">
              <GenericChartHtml
                  title="Total Assets"
                  desc="Number of active and inactive Total Assets"
                  rawData={{active:rows['activeTotalAsset'],inactive:rows['inActiveTotalAsset'], dataAssets: {aircraft:rows['aircraftsYearlyData'], engine: rows['enginesYearlyData'], apu: rows['apusYearlyData']}}}
                  step="monthly"
              />
            </div>
            <div className="col-xl-4">
              <GenericChartHtml
                  title="Aircraft"
                  desc="Number of active and inactive Aircraft"
                  rawData={{active:rows['activeAircraft'],inactive:rows['inActiveAircraft'], data: rows['aircraftsYearlyData']}}
                  chartType= "bar"
                  color = "#456645"
                  step="monthly"
              />
            </div>
            <div className="col-xl-4">
              <GenericChartHtml
                  title="Engines"
                  desc="Number of active and inactive Engines"
                  rawData={{active:rows['activeEngine'],inactive:rows['inActiveEngine'], data: rows['enginesYearlyData']}}
                  step="monthly"
              />
            </div>
          </div>

        <Portlet>
        <PortletBody fit={true}>
          <div className="row row-no-padding row-col-separator-xl">
            <div className="col-xl-4">
              <GenericChart
                title="APU's"
                desc="Number of active and inactive APU's"
                rawData={{active:rows['activeApu'],inactive:rows['inActiveApu'], data: rows['apusYearlyData']}}
                step="monthly"
              />
            </div>
            <div className="col-xl-4">
              <GenericChart
                title="Wanted"
                desc="Number of active and inactive Wanted"
                rawData={{active:rows['activeWanted'],inactive:rows['inActiveWanted'], data: rows['wantedYearlyData']}}
                step="monthly"
                chartType= "bar"
              />
            </div>
            <div className="col-xl-4">
              <GenericChart
                title="Parts"
                desc="Number of active and inactive Parts"
                rawData={{active:rows['activePart'],inactive:rows['inActivePart'], data: rows['partsYearlyData']}}
                step="monthly"
              />
            </div>
          </div>
        </PortletBody>
      </Portlet>

        <div className="row">
            <div className="col-xl-4">
              <GenericChartHtml
                  title="Airports"
                  desc="Number of active and inactive Airports"
                  rawData={{active:rows['activeAirport'],inactive:rows['inActiveAirport'], data: rows['airportsYearlyData']}}
                  step="monthly"
                  chartType= "bar"
              />
            </div>
            <div className="col-xl-4">
              <GenericChartHtml
                  title="News"
                  desc="Number of active and inactive News"
                  rawData={{active:rows['activeNews'],inactive:rows['inActiveNews'], data: rows['newsYearlyData']}}
                  step="monthly"
              />
            </div>
            <div className="col-xl-4">
              <GenericChartHtml
                  title="Events"
                  desc="Number of active and inactive Events"
                  rawData={{active:rows['activeEvent'],inactive:rows['inActiveEvent'], data: rows['eventsYearlyData']}}
                  step="monthly"
                  chartType= "bar"
              />
            </div>
          </div>

        <Paper>
            <Typography className={classes.title} variant="h5" component="h3">
                Recent Airbookers
            </Typography>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Company</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows['recentAirbookers'] && rows['recentAirbookers'].map(row => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {(row.contact && row.contact.first_name && row.contact.first_name !== '') ? row.contact.first_name +' '+ row.contact.last_name : ' -- '}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{(row.contact && row.contact.company && row.contact.company.name !== '') ? row.contact.company.name : ' -- '}</TableCell>
                      <TableCell align="right">{moment(row.created_at).format("DD/MM/YYYY")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
        </Paper>
    </>
  );
}
