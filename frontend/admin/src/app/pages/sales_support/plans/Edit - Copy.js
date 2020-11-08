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
    Divider, Typography,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import {list, MEDIA_URL, patch, post} from "../../../crud/api";
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        validated: false,
        plan1: {file: '', custom: []},
        plan2: {file: '', custom: []},
        plan3: {file: '', custom: []},
        customPlans: [{
            customHeading: {label: "", value: ""},
            customPlan1: { label: "", value: "" },
            customPlan2: { label: "", value: "" },
            customPlan3: { label: "", value: "" },
        }]
    };
    this.getPlans();
  }

  getPlans() {
    let filter = {};
     list('plans', filter).then(function (response) {
         if(response){
             response.data.map((value) => {
                 if(value.id === 1){
                    this.setState({
                        plan1 : value,
                        previewFilePlan1: value.media ? MEDIA_URL+value.media.original_file_name : null
                    });
                    this.setSelectfile('Plan1');
                 }else if(value.id === 2){
                     this.setState({
                         plan2 : value,
                         previewFilePlan2: value.media ? MEDIA_URL+value.media.original_file_name : null
                     });
                     this.setSelectfile('Plan2');
                 }else{
                     this.setState({
                         plan3 : value,
                         previewFilePlan3: value.media ? MEDIA_URL+value.media.original_file_name : null
                     });
                     this.setSelectfile('Plan3');
                 }
             });
         }
    }.bind(this));
  }

  setSelectfile(planName) {
      var planState = this.state[planName.toLowerCase()];
      if(planState.media) {
          let file = {};
          let selectedFile = 'selectedFile'+planName;
          let filename_pieces = planState.media.original_file_name.split('/');
          file.name_c = filename_pieces[filename_pieces.length - 1];
          this.setState({ [selectedFile]: file});
      }
  }

  handleCustomDataChange = (e, planName) => {
    if (["label", "value"].includes(e.target.dataset.class) ) {
      let customPlans = [...this.state.customPlans]
      customPlans[e.target.dataset.id][planName][e.target.dataset.class] = e.target.value
      this.setState({ customPlans }/*, () => console.log(this.state[planName])*/)
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  };

  handleAddCustomField  = (e) => {
    this.setState((prevState) => ({
      customPlans: [...prevState.customPlans, {
            customHeading: {label: "", value: ""},
            customPlan1: { label: "", value: "" },
            customPlan2: { label: "", value: "" },
            customPlan3: { label: "", value: "" },
        }],
    }));
  };

  handleRemoveCustomField  = (e) => {
     let customPlans = [...this.state.customPlans];
     customPlans.splice(e.target.dataset.id,1);
     this.setState({ customPlans : customPlans });
  }

  handleChange(event, planName) {
    var planState = this.state[planName];
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    planState[attr] = val;
    this.setState({[planName] : planState})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    let customPlans = this.state.customPlans;
    let plan1 = this.state.plan1;
    let plan2 = this.state.plan2;
    let plan3 = this.state.plan3;
    event.preventDefault();
    event.stopPropagation();
    let planNames = ['plan1','plan2', 'plan3'];
    this.setState({ validated: true });

    customPlans.map((plan, idx)=>{
        plan1.custom = plan1.custom.concat(
            {
                "main_heading": plan.customHeading.label,
                 "label": plan.customPlan1.label,
                "value": plan.customPlan1.value,
            }
            );

        plan2.custom = plan2.custom.concat(
            {
                "main_heading": plan.customHeading.label,
                "label": plan.customPlan2.label,
                "value": plan.customPlan2.value,
            }
            );

        plan3.custom = plan3.custom.concat(
            {
                "main_heading": plan.customHeading.label,
                "label": plan.customPlan3.label,
                "value": plan.customPlan3.value,
            },
        );

    })
    this.setState({
        plan1: plan1,
        plan2: plan2,
        plan3: plan3
    })
    if(this.state.plan1 && this.state.plan1.id){
        patch('plans/'+this.state.plan1.id+'/', this.state.plan1).then(
              (response) => {
                this.setState({plan1 : response.data});
            }).catch(error => {
                this.props.sendError(error.response.data);
        });
    }else if(this.state.plan1.title && this.state.plan1.title !== ''){
        post('plans', this.state.plan1).then(
          (response) => {
            this.setState({plan1 : response.data});
        }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    if(this.state.plan2 && this.state.plan2.id){
        patch('plans/'+this.state.plan2.id+'/', this.state.plan2).then(
              (response) => {
                this.setState({plan2 : response.data});
            }).catch(error => {
                this.props.sendError(error.response.data);
        });
    }else if(this.state.plan2.title && this.state.plan2.title !== ''){
        post('plans', this.state.plan2).then(
          (response) => {
            this.setState({plan2 : response.data});
        }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    if(this.state.plan3 && this.state.plan3.id){
        patch('plans/'+this.state.plan3.id+'/', this.state.plan3).then(
              (response) => {
                this.setState({plan3 : response.data});
            }).catch(error => {
                this.props.sendError(error.response.data);
        });
    }else if(this.state.plan3.title && this.state.plan3.title !== ''){
        post('plans', this.state.plan3).then(
          (response) => {
            this.setState({plan3 : response.data});
        }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

  }

  fileChangedHandler = (event, planName) => {
    let planState = this.state[planName];
    let file = event.target.files[0];
    let previewFile = 'previewFile'+planName.charAt(0).toUpperCase() + planName.slice(1);
    let selectedFile = 'selectedFile'+planName.charAt(0).toUpperCase() + planName.slice(1);
    this.setState({
      [previewFile]: URL.createObjectURL(file)
    });

    if(file != undefined) {
      file.size_c = file.size/1024;

      if((file.size_c)/1024 > 2) {
        file.size_c = (file.size_c/1024).toFixed(2) + ' MB';
        file.error = "Error: File is too big";
        planState.file = {};
        this.setState({[selectedFile]:file});
      } else {
        file.error = null;
        file.size_c = file.size_c.toFixed(2)+' KB';
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          planState.file = reader.result;
          this.setState({ [selectedFile]: file, [planState]:planState });
        };
      }
    }
  }
  handleFileRemove = (event, planName) => {
    let planState = this.state[planName];
    let selectedFile = 'selectedFile'+planName.charAt(0).toUpperCase() + planName.slice(1);
    planState.file = {}
    this.setState({[selectedFile]:null, [planState]:planState})
    document.getElementById(''+planName+'-image-upload').value = '';
  }

  render() {
    const {plan1, plan2, plan3, customPlans } = this.state;
    /*console.log('customPlans', customPlans)*/
    return (
      <Form
      noValidate
      onSubmit={e => this.handleSubmit(e)}
    >
          <Grid container style={{flexGrow: 1}} spacing={2}>
              <Grid item xs={12}>
                <Grid alignItems="stretch" container justify="center" direction="row" spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Paper className="pb-2">
                            <Typography className="p-3" variant="h5" component="h5" align="center">
                              Plan One
                            </Typography>
                            <Divider />
                            <Form.Group as={Col} md="12">
                              <input
                                accept="image/*"
                                style={{display: 'none'}}
                                type="file"
                                id="plan1-image-upload"
                                onChange={(e)=> this.fileChangedHandler(e, 'plan1')}
                              />
                              <br />
                              <label htmlFor="plan1-image-upload">
                                <ButtonCore variant="outlined" color="inherit" component="span">
                                  Select Image
                                  <CloudUploadIcon style={{marginLeft: '5px'}} />
                                </ButtonCore>
                              </label>
                              <div className="form-group form-group-last row">
                                <div className="col-12">
                                  <div className="dropzone dropzone-multi" id="kt_dropzone_5">
                                    <div className="dropzone-items" style={{display:this.state.selectedFilePlan1 ? 'block':'none'}}>
                                      <div className="dropzone-item" >
                                        <div className="dropzone-file">
                                          {this.state.previewFilePlan1 &&
                                            <div style={{'maxWidth':'250px'}}><img style={{ width: "100%" }} src={this.state.previewFilePlan1} /></div>
                                          }
                                          <div className="dropzone-filename" title="some_image_file_name.jpg">
                                            <span data-dz-name>{this.state.selectedFilePlan1 ? this.state.selectedFilePlan1.name_c : 'No file selected'}</span> <strong><span  data-dz-size>{this.state.selectedFilePlan1 && this.state.selectedFilePlan1.size_c ? '('+this.state.selectedFilePlan1.size_c+')' : ''}</span></strong>
                                          </div>
                                          <div className="dropzone-error" data-dz-errormessage>{this.state.selectedFilePlan1 && this.state.selectedFilePlan1.error ? this.state.selectedFilePlan1.error : ''}</div>
                                        </div>
                                        <div className="dropzone-toolbar">
                                          <span onClick={(e)=>this.handleFileRemove(e,'plan1')} className="dropzone-delete" data-dz-remove><i className="flaticon2-cross"></i></span>
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
                                value={plan1.title ? plan1.title:''}
                                onChange={e => this.handleChange(e,'plan1')}
                              />
                            </Form.Group>
                             <Form.Group as={Col} md="12">
                                <Form.Label>Sub Title *</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder=""
                                  name="sub_title"
                                  value={plan1.sub_title ? plan1.sub_title:''}
                                  onChange={e => this.handleChange(e,'plan1')}
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
                                        value={plan1.price_label ? plan1.price_label:''}
                                        onChange={e => this.handleChange(e,'plan1')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Price Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        model="companies"
                                        name="price"
                                        value={plan1.price ? plan1.price:''}
                                        onChange={e => this.handleChange(e,'plan1')}
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
                                  value={plan1.discount ? plan1.discount:''}
                                  onChange={e => this.handleChange(e,'plan1')}
                                />
                              </Form.Group>
                            <Form.Group as={Col} md="12">
                                <Form.Label>Button Label</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  name="button_label"
                                  value={plan1.button_label ? plan1.button_label:''}
                                  onChange={e => this.handleChange(e,'plan1')}
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
                                        value={plan1.aircraft_label ? plan1.aircraft_label:''}
                                        onChange={e => this.handleChange(e,'plan1')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Aircraft Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="aircraft_value"
                                        value={plan1.aircraft_value ? plan1.aircraft_value:''}
                                        onChange={e => this.handleChange(e,'plan1')}
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
                                        value={plan1.engine_label ? plan1.engine_label:''}
                                        onChange={e => this.handleChange(e,'plan1')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Engine Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="engine_value"
                                        value={plan1.engine_value ? plan1.engine_value:''}
                                        onChange={e => this.handleChange(e,'plan1')}
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
                                        value={plan1.apu_label ? plan1.apu_label:''}
                                        onChange={e => this.handleChange(e,'plan1')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>APU Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="apu_value"
                                        value={plan1.apu_value ? plan1.apu_value:''}
                                        onChange={e => this.handleChange(e,'plan1')}
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
                                        value={plan1.wanted_label ? plan1.wanted_label:''}
                                        onChange={e => this.handleChange(e,'plan1')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Wanted Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="wanted_value"
                                        value={plan1.wanted_value ? plan1.wanted_value:''}
                                        onChange={e => this.handleChange(e,'plan1')}
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
                                        value={plan1.parts_label ? plan1.parts_label:''}
                                        onChange={e => this.handleChange(e,'plan1')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Parts Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="parts_value"
                                        value={plan1.parts_value ? plan1.parts_value:''}
                                        onChange={e => this.handleChange(e,'plan1')}
                                      />
                                    </Form.Group>
                                </FormControl>
                            </Form.Group>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className="pb-2">
                            <Typography className="p-3" variant="h5" component="h5" align="center">
                              Plan Two
                            </Typography>
                            <Divider />
                            <Form.Group as={Col} md="12">
                              <input
                                accept="image/*"
                                style={{display: 'none'}}
                                type="file"
                                id="plan2-image-upload"
                                onChange={(e)=> this.fileChangedHandler(e, 'plan2')}
                              />
                              <br />
                              <label htmlFor="plan2-image-upload">
                                <ButtonCore variant="outlined" color="inherit" component="span">
                                  Select Image
                                  <CloudUploadIcon style={{marginLeft: '5px'}} />
                                </ButtonCore>
                              </label>
                              <div className="form-group form-group-last row">
                                <div className="col-12">
                                  <div className="dropzone dropzone-multi" id="kt_dropzone_5">
                                    <div className="dropzone-items" style={{display:this.state.selectedFilePlan2 ? 'block':'none'}}>
                                      <div className="dropzone-item" >
                                        <div className="dropzone-file">
                                          {this.state.previewFilePlan2 &&
                                            <div style={{'maxWidth':'250px'}}><img style={{ width: "100%" }} src={this.state.previewFilePlan2} /></div>
                                          }
                                          <div className="dropzone-filename" title="some_image_file_name.jpg">
                                            <span data-dz-name>{this.state.selectedFilePlan2 ? this.state.selectedFilePlan2.name_c : 'No file selected'}</span> <strong><span  data-dz-size>{this.state.selectedFilePlan2 && this.state.selectedFilePlan2.size_c ? '('+this.state.selectedFilePlan2.size_c+')' : ''}</span></strong>
                                          </div>
                                          <div className="dropzone-error" data-dz-errormessage>{this.state.selectedFilePlan2 && this.state.selectedFilePlan2.error ? this.state.selectedFilePlan2.error : ''}</div>
                                        </div>
                                        <div className="dropzone-toolbar">
                                          <span onClick={(e)=>this.handleFileRemove(e,'plan2')} className="dropzone-delete" data-dz-remove><i className="flaticon2-cross"></i></span>
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
                                value={plan2.title ? plan2.title:''}
                                onChange={e => this.handleChange(e,'plan2')}
                              />
                            </Form.Group>
                             <Form.Group as={Col} md="12">
                                <Form.Label>Sub Title *</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder=""
                                  name="sub_title"
                                  value={plan2.sub_title ? plan2.sub_title:''}
                                  onChange={e => this.handleChange(e,'plan2')}
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
                                        value={plan2.price_label ? plan2.price_label:''}
                                        onChange={e => this.handleChange(e,'plan2')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Price Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        model="companies"
                                        name="price"
                                        value={plan2.price ? plan2.price:''}
                                        onChange={e => this.handleChange(e,'plan2')}
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
                                  value={plan2.discount ? plan2.discount:''}
                                  onChange={e => this.handleChange(e,'plan2')}
                                />
                              </Form.Group>
                            <Form.Group as={Col} md="12">
                                <Form.Label>Button Label</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  name="button_label"
                                  value={plan2.button_label ? plan2.button_label:''}
                                  onChange={e => this.handleChange(e,'plan2')}
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
                                        value={plan2.aircraft_label ? plan2.aircraft_label:''}
                                        onChange={e => this.handleChange(e,'plan2')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Aircraft Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="aircraft_value"
                                        value={plan2.aircraft_value ? plan2.aircraft_value:''}
                                        onChange={e => this.handleChange(e,'plan2')}
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
                                        value={plan2.engine_label ? plan2.engine_label:''}
                                        onChange={e => this.handleChange(e,'plan2')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Engine Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="engine_value"
                                        value={plan2.engine_value ? plan2.engine_value:''}
                                        onChange={e => this.handleChange(e,'plan2')}
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
                                        value={plan2.apu_label ? plan2.apu_label:''}
                                        onChange={e => this.handleChange(e,'plan2')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>APU Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="apu_value"
                                        value={plan2.apu_value ? plan2.apu_value:''}
                                        onChange={e => this.handleChange(e,'plan2')}
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
                                        value={plan2.wanted_label ? plan2.wanted_label:''}
                                        onChange={e => this.handleChange(e,'plan2')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Wanted Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="wanted_value"
                                        value={plan2.wanted_value ? plan2.wanted_value:''}
                                        onChange={e => this.handleChange(e,'plan2')}
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
                                        value={plan2.parts_label ? plan2.parts_label:''}
                                        onChange={e => this.handleChange(e,'plan2')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Parts Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="parts_value"
                                        value={plan2.parts_value ? plan2.parts_value:''}
                                        onChange={e => this.handleChange(e,'plan2')}
                                      />
                                    </Form.Group>
                                </FormControl>
                            </Form.Group>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className="pb-2">
                            <Typography className="p-3" variant="h5" component="h5" align="center">
                              Plan Three
                            </Typography>
                            <Divider />
                            <Form.Group as={Col} md="12">
                              <input
                                accept="image/*"
                                style={{display: 'none'}}
                                type="file"
                                id="plan3-image-upload"
                                onChange={(e)=> this.fileChangedHandler(e, 'plan3')}
                              />
                              <br />
                              <label htmlFor="plan3-image-upload">
                                <ButtonCore variant="outlined" color="inherit" component="span">
                                  Select Image
                                  <CloudUploadIcon style={{marginLeft: '5px'}} />
                                </ButtonCore>
                              </label>
                              <div className="form-group form-group-last row">
                                <div className="col-12">
                                  <div className="dropzone dropzone-multi" id="kt_dropzone_5">
                                    <div className="dropzone-items" style={{display:this.state.selectedFilePlan3 ? 'block':'none'}}>
                                      <div className="dropzone-item" >
                                        <div className="dropzone-file">
                                          {this.state.previewFilePlan3 &&
                                            <div style={{'maxWidth':'250px'}}><img style={{ width: "100%" }} src={this.state.previewFilePlan3} /></div>
                                          }
                                          <div className="dropzone-filename" title="some_image_file_name.jpg">
                                            <span data-dz-name>{this.state.selectedFilePlan3 ? this.state.selectedFilePlan3.name_c : 'No file selected'}</span> <strong><span  data-dz-size>{this.state.selectedFilePlan3 && this.state.selectedFilePlan3.size_c ? '('+this.state.selectedFilePlan3.size_c+')' : ''}</span></strong>
                                          </div>
                                          <div className="dropzone-error" data-dz-errormessage>{this.state.selectedFilePlan3 && this.state.selectedFilePlan3.error ? this.state.selectedFilePlan3.error : ''}</div>
                                        </div>
                                        <div className="dropzone-toolbar">
                                          <span onClick={(e)=>this.handleFileRemove(e,'plan3')} className="dropzone-delete" data-dz-remove><i className="flaticon2-cross"></i></span>
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
                                value={plan3.title ? plan3.title:''}
                                onChange={e => this.handleChange(e,'plan3')}
                              />
                            </Form.Group>
                             <Form.Group as={Col} md="12">
                                <Form.Label>Sub Title *</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder=""
                                  name="sub_title"
                                  value={plan3.sub_title ? plan3.sub_title:''}
                                  onChange={e => this.handleChange(e,'plan3')}
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
                                        value={plan3.price_label ? plan3.price_label:''}
                                        onChange={e => this.handleChange(e,'plan3')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Price Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        model="companies"
                                        name="price"
                                        value={plan3.price ? plan3.price:''}
                                        onChange={e => this.handleChange(e,'plan3')}
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
                                  value={plan3.discount ? plan3.discount:''}
                                  onChange={e => this.handleChange(e,'plan3')}
                                />
                              </Form.Group>
                            <Form.Group as={Col} md="12">
                                <Form.Label>Button Label</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  name="button_label"
                                  value={plan3.button_label ? plan3.button_label:''}
                                  onChange={e => this.handleChange(e,'plan3')}
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
                                        value={plan3.aircraft_label ? plan3.aircraft_label:''}
                                        onChange={e => this.handleChange(e,'plan3')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Aircraft Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="aircraft_value"
                                        value={plan3.aircraft_value ? plan3.aircraft_value:''}
                                        onChange={e => this.handleChange(e,'plan3')}
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
                                        value={plan3.engine_label ? plan3.engine_label:''}
                                        onChange={e => this.handleChange(e,'plan3')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Engine Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="engine_value"
                                        value={plan3.engine_value ? plan3.engine_value:''}
                                        onChange={e => this.handleChange(e,'plan3')}
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
                                        value={plan3.apu_label ? plan3.apu_label:''}
                                        onChange={e => this.handleChange(e,'plan3')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>APU Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="apu_value"
                                        value={plan3.apu_value ? plan3.apu_value:''}
                                        onChange={e => this.handleChange(e,'plan3')}
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
                                        value={plan3.wanted_label ? plan3.wanted_label:''}
                                        onChange={e => this.handleChange(e,'plan3')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Wanted Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="wanted_value"
                                        value={plan3.wanted_value ? plan3.wanted_value:''}
                                        onChange={e => this.handleChange(e,'plan3')}
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
                                        value={plan3.parts_label ? plan3.parts_label:''}
                                        onChange={e => this.handleChange(e,'plan3')}
                                      />
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" className="mb-0">
                                      <Form.Label>Parts Value</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        name="parts_value"
                                        value={plan3.parts_value ? plan3.parts_value:''}
                                        onChange={e => this.handleChange(e,'plan3')}
                                      />
                                    </Form.Group>
                                </FormControl>
                            </Form.Group>
                        </Paper>
                    </Grid>
                </Grid>
              </Grid>
          </Grid>
          <div className="kt-space-20" />
          <Paper className="pb-2">
            <Typography className="p-3" variant="h5" component="h5" align="center">
              Custom Fields for Plans
            </Typography>
              {
                  customPlans.map((plans, index)=>{
                      return(
                          <div key={index} className="row row-no-padding row-col-separator-xl">
                              <div className="col-xl-2">
                                    <Form.Group as={Col} md="12" className="mb-3 mt-3">
                                        <Form.Label>{`Main heading`}</Form.Label>
                                        <Form.Control
                                          type="text"
                                            data-id={index}
                                            data-class="label"
                                            data-input="main_heading"
                                            value={plans.customHeading.label}
                                            onChange={(e)=> this.handleCustomDataChange(e, 'customHeading')}
                                            className="label"
                                        />
                                      </Form.Group>
                              </div>
                              <div className="col-xl-3">
                                    <Form.Group as={Col} md="12" className="mb-3 mt-3">
                                        <Form.Label>Label Plan 1</Form.Label>
                                        <Form.Control
                                          type="text"
                                            data-id={index}
                                            data-class="label"
                                            value={plans.customPlan1.label}
                                            onChange={(e)=> this.handleCustomDataChange(e, 'customPlan1')}
                                            className="label"
                                        />
                                        <Form.Label>Value Plan 1</Form.Label>
                                        <Form.Control
                                          type="text"
                                          data-id={index}
                                          data-class="value"
                                          value={plans.customPlan1.value}
                                          onChange={(e)=> this.handleCustomDataChange(e, 'customPlan1')}
                                          className="value"
                                        />
                                      </Form.Group>
                              </div>
                              <div className="col-xl-3">
                                    <Form.Group as={Col} md="12" className="mb-3 mt-3">
                                        <Form.Label>Label Plan 2</Form.Label>
                                        <Form.Control
                                          type="text"
                                            data-id={index}
                                            data-class="label"
                                            value={plans.customPlan2.label}
                                            onChange={(e)=> this.handleCustomDataChange(e, 'customPlan2')}
                                            className="label"
                                        />
                                        <Form.Label>Value Plan 2</Form.Label>
                                        <Form.Control
                                          type="text"
                                          data-id={index}
                                          data-class="value"
                                          value={plans.customPlan2.value}
                                          onChange={(e)=> this.handleCustomDataChange(e, 'customPlan2')}
                                          className="value"
                                        />
                                      </Form.Group>
                              </div>
                              <div className="col-xl-3">
                                    <Form.Group as={Col} md="12" className="mb-3 mt-3">
                                        <Form.Label>Label Plan 3</Form.Label>
                                        <Form.Control
                                          type="text"
                                            data-id={index}
                                            data-class="label"
                                            value={plans.customPlan3.label}
                                            onChange={(e)=> this.handleCustomDataChange(e, 'customPlan3')}
                                            className="label"
                                        />
                                        <Form.Label>Value Plan 3</Form.Label>
                                        <Form.Control
                                          type="text"
                                          data-id={index}
                                          data-class="value"
                                          value={plans.customPlan3.value}
                                          onChange={(e)=> this.handleCustomDataChange(e, 'customPlan3')}
                                          className="value"
                                        />
                                      </Form.Group>
                              </div>
                              <div className="col-xl-1 d-flex align-items-center">
                                  <Form.Group as={Col} md="12" className="mb-3 mt-3">
                                      <Button data-id={index} type="button" className="btn btn-danger" onClick={this.handleRemoveCustomField}>
                                          <i className="la la-minus" />
                                          Remove
                                      </Button>
                                  </Form.Group>
                              </div>
                          </div>
                      )
                  })
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