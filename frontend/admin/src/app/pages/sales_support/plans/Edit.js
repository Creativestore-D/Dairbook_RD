import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import {
    Grid,
    FormControl,
    Button as ButtonCore,
    Paper,
    FormLabel,
    Divider, Typography, SnackbarContent, Snackbar, IconButton
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import {list, MEDIA_URL, patch, post} from "../../../crud/api";
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon, Info as InfoIcon,
    Warning as WarningIcon
} from '@material-ui/icons';
import { withStyles } from "@material-ui/core/styles";
import { amber, green } from '@material-ui/core/colors';
import clsx from "clsx";
import PropTypes from "prop-types";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};
const useStylesSnackbarContent = theme => ({
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
});
function AeroSnackbarContent(props){
    const { classes, className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];
    return(
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

AeroSnackbarContent.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

const SnackbarContentWrapper = withStyles(useStylesSnackbarContent)(AeroSnackbarContent);

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        validated: false,
        plans:[],
        open: false,
        snackMessage: 'Changes have been applied.',
        variant: 'success',
    };
    this.getPlans();
  }

  getPlans() {
     list('plans').then(function (response) {
         if(response){
             response.data.map((value) => {
                this.setState({plans:response.data});
                this.setSelectfile();
             });
         }
    }.bind(this));
  }

  setSelectfile() {
    this.state.plans.map((val, i) => {
      if(val.media) {
          let file = {};
          let selectedFile = 'selectedFilePlan'+i;
          let previewFile = 'previewFilePlan'+i;
          let filename_pieces = val.media.original_file_name.split('/');
          file.name_c = filename_pieces[filename_pieces.length - 1];
          this.setState({ [selectedFile]: file , [previewFile]: MEDIA_URL+val.media.original_file_name});
      }
    })
  }

  handleCustomDataChange = (e, custom_index, plan_index) => {
    let plans = [];
    this.state.plans.map((val, i) => {
      if(plan_index === 'all' || plan_index === i )
        val.custom[custom_index][e.target.name] = e.target.value
      plans.push(val)
    })
    this.setState({plans: plans });
  };

  handleAddCustomField  = (e) => {
    let plans = [];
    this.state.plans.map((val, i) => {
      val.custom.push({
        "main_heading" : "",
        "label" : "",
        "value" : ""
      })
      plans.push(val);
    })
    this.setState({plans: plans })
  };

  handleRemoveCustomField  = (e, custom_index) => {
    let plans = [];
    this.state.plans.map((val, index) => {
      let custom = val.custom.filter((v, i) => i !== custom_index);
      val.custom = custom;
      plans.push(val);
    })
    this.setState({plans: plans }); 
  }

  handleChange(event, index) {
    var plans = this.state.plans;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    plans[index][attr] = val;
    this.setState({plans : plans})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    let isError = false;

    let plans = this.state.plans;
    plans.map((row, i) => {
      patch('plans/'+row.id+'/', row).then(
            (response) => {
              let newPlans = this.state.plans;
              newPlans[i] = response.data;
              this.setState({plans : newPlans});
              this.setState({variant: "success"});
              this.setState({snackMessage: "Record successfully saved."});

          }).catch(error => {
              isError = true;
              this.setState({variant: "error"});
              this.props.sendError(error.response.data);
              this.setState({snackMessage: "An error occurred while saving."});
          });
    })
      this.setState({ open: true });
  }

  fileChangedHandler = (event, index) => {
    let plans = this.state.plans;
    let file = event.target.files[0];
    let previewFile = 'previewFilePlan'+index;
    let selectedFile = 'selectedFilePlan'+index;
    this.setState({
      [previewFile]: URL.createObjectURL(file)
    });

    if(file != undefined) {
      file.size_c = file.size/1024;

      if((file.size_c)/1024 > 2) {
        file.size_c = (file.size_c/1024).toFixed(2) + ' MB';
        file.error = "Error: File is too big";
        plans[index].file = {};
        this.setState({[selectedFile]:file});
      } else {
        file.error = null;
        file.size_c = file.size_c.toFixed(2)+' KB';
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          plans[index].file = reader.result;
          this.setState({ [selectedFile]: file, plans:plans });
        };
      }
    }
  }
  handleFileRemove = (event, index) => {
    let plans = this.state.plans;
    let selectedFile = 'selectedFilePlan'+index;
    plans[index].file = {}
    this.setState({[selectedFile]:null, plans:plans})
    document.getElementById('plan'+index+'-image-upload').value = '';
  }

  handleCloseSnackbar = (event) => {
    this.setState({ open: false })
  };

  render() {
    const {plans} = this.state;
    return (
        <div>
           <Form
               noValidate
               onSubmit={e => this.handleSubmit(e)}
            >
                  <Grid container style={{flexGrow: 1}} spacing={2}>
                      <Grid item xs={12}>
                        <Grid alignItems="stretch" container justify="center" direction="row" spacing={2}>
                            {plans.map((val, i) => {
                              return <Grid key={i} item xs={12} sm={4}>
                                  <Paper className="pb-2">
                                      <Typography className="p-3" variant="h5" component="h5" align="center">
                                        Plan {i === 0 ? 'One' : (i === 1 ? 'Two' : 'Three')}
                                      </Typography>
                                      <Divider />
                                      <Form.Group as={Col} md="12">
                                        <input
                                          accept="image/*"
                                          style={{display: 'none'}}
                                          type="file"
                                          id={"plan"+i+"-image-upload"}
                                          onChange={(e)=> this.fileChangedHandler(e, i)}
                                        />
                                        <br />
                                        <label htmlFor={"plan"+i+"-image-upload"}>
                                          <ButtonCore variant="outlined" color="inherit" component="span">
                                            Select Image
                                            <CloudUploadIcon style={{marginLeft: '5px'}} />
                                          </ButtonCore>
                                        </label>
                                        <div className="form-group form-group-last row">
                                          <div className="col-12">
                                            <div className="dropzone dropzone-multi" id="kt_dropzone_5">
                                              <div className="dropzone-items" style={{display:this.state['selectedFilePlan'+i] ? 'block':'none'}}>
                                                <div className="dropzone-item" >
                                                  <div className="dropzone-file">
                                                    {this.state['previewFilePlan'+i] &&
                                                      <div style={{'maxWidth':'250px'}}><img style={{ width: "100%" }} src={this.state['previewFilePlan'+i]} /></div>
                                                    }
                                                    <div className="dropzone-filename" title="some_image_file_name.jpg">
                                                      <span data-dz-name>{this.state['selectedFilePlan'+i] ? this.state['selectedFilePlan'+i].name_c : 'No file selected'}</span> <strong><span  data-dz-size>{this.state['selectedFilePlan'+i] && this.state['selectedFilePlan'+i].size_c ? '('+this.state['selectedFilePlan'+i].size_c+')' : ''}</span></strong>
                                                    </div>
                                                    <div className="dropzone-error" data-dz-errormessage>{this.state['selectedFilePlan'+i] && this.state['selectedFilePlan'+i].error ? this.state['selectedFilePlan'+i].error : ''}</div>
                                                  </div>
                                                  <div className="dropzone-toolbar">
                                                    <span onClick={(e)=>this.handleFileRemove(e,i)} className="dropzone-delete" data-dz-remove><i className="flaticon2-cross"></i></span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <span className="form-text text-muted">Max file size is 2MB.</span>
                                          </div>
                                        </div>
                                      </Form.Group>
                                      <Form.Group as={Col} md="12">
                                        <Form.Label>Title *</Form.Label>
                                        <Form.Control
                                          required
                                          type="text"
                                          placeholder=""
                                          model="companies"
                                          name="title"
                                          value={val.title ? val.title:''}
                                          onChange={e => this.handleChange(e,i)}
                                        />
                                      </Form.Group>
                                       <Form.Group as={Col} md="12">
                                          <Form.Label>Sub Title *</Form.Label>
                                          <Form.Control
                                            required
                                            type="text"
                                            placeholder=""
                                            name="sub_title"
                                            value={val.sub_title ? val.sub_title:''}
                                            onChange={e => this.handleChange(e,i)}
                                          />
                                        </Form.Group>
                                      <Form.Group as={Col} md="12">
                                          <FormControl component="fieldset" fullWidth={true}>
                                              <FormLabel component="legend">Plan Price</FormLabel>
                                              <Form.Group as={Col} md="12">
                                                <Form.Label>Price Label</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  model="companies"
                                                  name="price_label"
                                                  value={val.price_label ? val.price_label:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                              <Form.Group as={Col} md="12" className="mb-0">
                                                <Form.Label>Price Value</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  model="companies"
                                                  name="price"
                                                  value={val.price ? val.price:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                          </FormControl>
                                      </Form.Group>
                                      <Form.Group as={Col} md="12">
                                          <Form.Label>Plan Discout</Form.Label>
                                          <Form.Control
                                            type="number"
                                            placeholder=""
                                            name="discount"
                                            value={val.discount ? val.discount:''}
                                            onChange={e => this.handleChange(e,i)}
                                          />
                                        </Form.Group>
                                      <Form.Group as={Col} md="12">
                                          <Form.Label>Button Label</Form.Label>
                                          <Form.Control
                                            type="text"
                                            placeholder=""
                                            name="button_label"
                                            value={val.button_label ? val.button_label:''}
                                            onChange={e => this.handleChange(e,i)}
                                          />
                                        </Form.Group>
                                      <Form.Group as={Col} md="12">
                                          <FormControl component="fieldset" fullWidth={true}>
                                              <FormLabel component="legend">Aircraft</FormLabel>
                                              <Form.Group as={Col} md="12">
                                                <Form.Label>Aircraft Label</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="aircraft_label"
                                                  value={val.aircraft_label ? val.aircraft_label:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                              <Form.Group as={Col} md="12" className="mb-0">
                                                <Form.Label>Aircraft Value</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="aircraft_value"
                                                  value={val.aircraft_value ? val.aircraft_value:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                          </FormControl>
                                      </Form.Group>
                                      <Form.Group as={Col} md="12">
                                          <FormControl component="fieldset" fullWidth={true}>
                                              <FormLabel component="legend">Engine</FormLabel>
                                              <Form.Group as={Col} md="12">
                                                <Form.Label>Engine Label</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="engine_label"
                                                  value={val.engine_label ? val.engine_label:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                              <Form.Group as={Col} md="12" className="mb-0">
                                                <Form.Label>Engine Value</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="engine_value"
                                                  value={val.engine_value ? val.engine_value:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                          </FormControl>
                                      </Form.Group>
                                      <Form.Group as={Col} md="12">
                                          <FormControl component="fieldset" fullWidth={true}>
                                              <FormLabel component="legend">APU</FormLabel>
                                              <Form.Group as={Col} md="12">
                                                <Form.Label>APU Label</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="apu_label"
                                                  value={val.apu_label ? val.apu_label:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                              <Form.Group as={Col} md="12" className="mb-0">
                                                <Form.Label>APU Value</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="apu_value"
                                                  value={val.apu_value ? val.apu_value:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                          </FormControl>
                                      </Form.Group>
                                      <Form.Group as={Col} md="12">
                                          <FormControl component="fieldset" fullWidth={true}>
                                              <FormLabel component="legend">Wanted</FormLabel>
                                              <Form.Group as={Col} md="12">
                                                <Form.Label>Wanted Label</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="wanted_label"
                                                  value={val.wanted_label ? val.wanted_label:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                              <Form.Group as={Col} md="12" className="mb-0">
                                                <Form.Label>Wanted Value</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="wanted_value"
                                                  value={val.wanted_value ? val.wanted_value:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                          </FormControl>
                                      </Form.Group>
                                      <Form.Group as={Col} md="12">
                                          <FormControl component="fieldset" fullWidth={true}>
                                              <FormLabel component="legend">Parts</FormLabel>
                                              <Form.Group as={Col} md="12">
                                                <Form.Label>Parts Label</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="parts_label"
                                                  value={val.parts_label ? val.parts_label:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                              <Form.Group as={Col} md="12" className="mb-0">
                                                <Form.Label>Parts Value</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  placeholder=""
                                                  name="parts_value"
                                                  value={val.parts_value ? val.parts_value:''}
                                                  onChange={e => this.handleChange(e,i)}
                                                />
                                              </Form.Group>
                                          </FormControl>
                                      </Form.Group>
                                  </Paper>
                              </Grid>
                            })}
                        </Grid>
                      </Grid>
                  </Grid>
                  <div className="kt-space-20" />
                  <Paper className="pb-2">
                    <Typography className="p-3" variant="h5" component="h5" align="center">
                      Custom Fields for Plans
                    </Typography>
                      {
                        plans.length ?
                          plans[0].custom.map((plan, index)=>{
                              return(
                                  <div key={index} className="row row-no-padding row-col-separator-xl">
                                      <div className="col-xl-2">
                                            <Form.Group as={Col} md="12" className="mb-3 mt-3">
                                                <Form.Label>{`Main heading`}</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                    data-input="main_heading"
                                                    value={plan.main_heading}
                                                    name="main_heading"
                                                    onChange={(e)=> this.handleCustomDataChange(e, index, 'all')}
                                                    className="label"
                                                />
                                              </Form.Group>
                                      </div>
                                      {plans.map((val, i) => {
                                        return(
                                          <div key={i} className="col-xl-3">
                                            <Form.Group as={Col} md="12" className="mb-3 mt-3">
                                                <Form.Label>Label Plan  {i === 0 ? 'One' : (i === 1 ? 'Two' : 'Three')}</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                    value={val.custom[index].label}
                                                    name="label"
                                                    onChange={(e)=> this.handleCustomDataChange(e, index, i)}
                                                    className="label"
                                                />
                                                <Form.Label>Value Plan  {i === 0 ? 'One' : (i === 1 ? 'Two' : 'Three')}</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  name="value"
                                                  value={val.custom[index].value}
                                                  onChange={(e)=> this.handleCustomDataChange(e, index, i)}
                                                  className="value"
                                                />
                                              </Form.Group>
                                          </div>
                                        )
                                      })}
                                      <div className="col-xl-1 d-flex align-items-center">
                                          <Form.Group as={Col} md="12" className="mb-3 mt-3">
                                              <Button data-id={index} type="button" className="btn btn-danger" onClick={(e)=>this.handleRemoveCustomField(e, index)}>
                                                  <i className="la la-minus" />
                                                  Remove
                                              </Button>
                                          </Form.Group>
                                      </div>
                                  </div>
                              )
                          })
                          :''
                      }
                      <div className="kt-space-20" />
                      <div className="row">
                          <div className="col-xl-12">
                              <Form.Group as={Col} md="12" className="mb-3">
                                  <Button type="button" className="btn btn-success" onClick={this.handleAddCustomField}>
                                      <i className="la la-plus" />
                                      Add new row
                                  </Button>
                              </Form.Group>
                          </div>
                      </div>
                  </Paper>
                  <div className="kt-space-20" />
                <Button type="submit" className="btn btn-primary">
                  <i className="la la-save" />
                  Update
                </Button>
                &nbsp;&nbsp;

                <Link to={"/admin/companies"} className="btn btn-danger">
                  <i className="la la-remove" />
                  Cancel
                </Link>
            </Form>
            <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                open={this.state.open}
                onClose={this.handleCloseSnackbar}
                autoHideDuration={5000}
            >
                <SnackbarContentWrapper
                  onClose={this.handleCloseSnackbar}
                  variant={this.state.variant}
                  message={this.state.snackMessage}
                />
            </Snackbar>
        </div>

     );
  }
}

class EditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {errors:[], showError:false};
    this.sendError = this.sendError.bind(this);
  }

  sendError(err, errors=[]) {
    if(Object.keys(err).length){
      for (let index in Object.keys(err)) {
        let innerErr = Object.keys(err)[index];
        if(Array.isArray(err[innerErr])) {
          for (let i in err[innerErr]) {
              if(typeof err[innerErr][i] === 'object') {
                  this.sendError(err[innerErr][i], errors);
              }else
                errors.push(innerErr.charAt(0).toUpperCase() + innerErr.slice(1)+' : '+err[innerErr][i]);
          }
        } else {
          return this.sendError(err[innerErr], errors);
        }
      }
      this.setState({showError:true});
    }

    this.setState({errors:errors});
  }

  render() {
    return (
      <>
         <Notice icon="flaticon-warning kt-font-primary" style={{display: this.state.showError ? 'flex' : 'none' }}>
        {
          this.state.errors.map((val, i) => {
              return <li key={i}>{val}</li>
          })
        }
        </Notice>

        <div className="row">
          <div className="col-md-12">
            <CustomHead
              beforeCodeTitle={'Plans'}
              jsCode =   {<div className="kt-portlet__head-toolbar">
            </div>}
            >
              <div className="kt-section">
                <Edit data = {this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(EditPage);