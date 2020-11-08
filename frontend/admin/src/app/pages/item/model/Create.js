import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button as ButtonCore,
} from "@material-ui/core";
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";
import { Link, withRouter } from 'react-router-dom'
import { list, post } from "../../../crud/api";
import Select from 'react-select';



class Create extends React.Component {

  constructor(props) {
    super(props);
    const type = this.props.data.match.params.type;
    this.state = {
      type : type,
      model:{type: type, is_active: 0},
      type_0:{label:'Select Type', value:0},
      types:[],
      selectedFile: null,
      previewFile: null,
      validated: false,
      action:'',
    };

    // this.getTypes();
    this.loadModels();
  }

  loadModels() {
		let models = {
			'AbTypes':{type: this.state.type},
		}
		post('abmodels', {models:models}).then(function(response){
			for(let opt in response.data){
				response.data[opt].map((row, i) => {
					response.data[opt][i].label = row.name;
					response.data[opt][i].value = row.id;
				})
			}
			this.setState({
				types:response.data.AbTypes,
			})
		}.bind(this))
  }

  selectType(value, key) {
    let model = this.state.model;
    model.type_0 = value && value.value ? value.value : '';
    this.setState({ [key]: value ? value : '', model: model});
  }

  handleChange(event) {
    var model = this.state.model;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    model[attr] = val;
    this.setState({model : model})
  }
  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    post('model', this.state.model).then(
      (response) => {
        this.setState({model : response.data});
        this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm(this.state.type+"-model-form"):"/admin/"+this.state.type+"/model");
      }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }
  
  fileChangedHandler = (event) => {
    let model = this.state.model;
    let file = event.target.files[0];
    this.setState({
      previewFile: URL.createObjectURL(file)
    });
    if(file != undefined) {
      file.size_c = file.size/1024;

      if((file.size_c)/1024 > 2) {
        file.size_c = (file.size_c/1024).toFixed(2) + ' MB';
        file.error = "Error: File is too big";
        model.file = {};
        this.setState({selectedFile:file});
      } else {
        file.error = null;
        file.size_c = file.size_c.toFixed(2)+' KB';
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          model.file = reader.result;
          this.setState({ selectedFile: file, model:model });
        };
      }
    }
  }

  handleFileRemove = (event) => {
    let model = this.state.model;
    model.file = {}
    this.setState({selectedFile:null, model:model})
    document.getElementById('model-image-upload').value = '';
  }
  clearForm = (id) => { 
    document.getElementById(id).reset();
    this.setState({selectedFile: null, previewFile: null});
  }

  render() {
    const { validated, model, type_0, types, selectedFile } = this.state;
    return (
      <Form
        noValidate
        id={this.state.type+"-model-form"}
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="6">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="model"
              name="name"
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
          <Form.Label>Type *</Form.Label>
            <Select
              value={type_0}
              model="type"
              name="type"
              isClearable = {true}
              escapeClearsValue = {true}
              onChange={e => this.selectType(e, 'type_0')}
              options={types}
            />
          </Form.Group>
          <Form.Group as={Col} md="12">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows="5"
              model="model"
              name="description"
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
        <Form.Group as={Col} md="12">
              <input
                accept="image/*"
                style={{display: 'none'}}
                type="file"
                id="model-image-upload"
                name= "image"
                onChange={this.fileChangedHandler}
              />
              <br />
              <label htmlFor="model-image-upload">
                <ButtonCore variant="outlined" color="inherit" component="span">
                  Select Image
                  <CloudUploadIcon style={{marginLeft: '5px'}} />
                </ButtonCore>
              </label>
              <div className="form-group form-group-last row">
                <div className="col-12 col-md-4">
                  <div className="dropzone dropzone-multi" id="kt_dropzone_5">
                    <div className="dropzone-items" style={{display:selectedFile ? 'block':'none'}}>
                      <div className="dropzone-item" >
                        <div className="dropzone-file">
                          {this.state.previewFile &&
                            <div style={{'max-width':'250px'}}><img style={{ width: "100%" }} src={this.state.previewFile} /></div>
                          }
                          <div className="dropzone-filename" title="some_image_file_name.jpg">
                            <span data-dz-name>{selectedFile ? selectedFile.name : 'No file selected'}</span> <strong>(<span  data-dz-size>{selectedFile && selectedFile.size_c ? selectedFile.size_c : ''}</span>)</strong>
                          </div>
                          <div className="dropzone-error" data-dz-errormessage>{selectedFile && selectedFile.error ? selectedFile.error : ''}</div>
                        </div>
                        <div className="dropzone-toolbar">
                          <span onClick={(e)=>this.handleFileRemove(e)} className="dropzone-delete" data-dz-remove><i className="flaticon2-cross"></i></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="form-text text-muted">Max file size is 2MB.</span>
                </div>
              </div>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="12">
            <FormControl component="fieldset" className="col-md-12">
              <RadioGroup
                aria-label="status"
                name="is_active"
                className="col-md-12"
                value={model.is_active === 1 ? '1' : '0'}
                onChange={e => this.handleChange(e)}
              >
                <FormControlLabel className="col-md-2" value="1" control={<Radio />} label="Publish" />
                <FormControlLabel className="col-md-2" value="0" control={<Radio />} label="Inactive" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
        </Form.Row>
        <Button type="submit" onClick={(e) => this.setState({action:'save'})} className="btn btn-primary">
          <i className="la la-save" />
          Save & Close
        </Button>
        &nbsp;&nbsp;

        <Button type="submit" onClick={(e) => this.setState({action:'save_new'})} className="btn btn-success">
          <i className="la la-save" />
          Save & New
        </Button>
        &nbsp;&nbsp;

        <Link to={"/admin/"+this.state.type+"/model"} className="btn btn-danger">
          <i className="la la-remove" />
          Cancel
        </Link>
      </Form>
    );
  }
}

class CreatePage extends React.Component {
  constructor(props) {
    super(props);
    let type = props.match.params.type;
    this.state = {errors:{}, showError:false};
    this.state.type = type;
    this.sendError = this.sendError.bind(this);
  }

  sendError(error) {
    if(Object.keys(error).length)
      this.setState({showError:true});

    this.setState({errors:error});
  }

  render() {
    return (
      <>
        <Notice icon="flaticon-warning kt-font-primary" style={{display: this.state.showError ? 'flex' : 'none' }}>
        { 
          Object.keys(this.state.errors).map((key, index) => {
            return this.state.errors[key].map((error, i) => {
              console.log(error);
              return <li key={index+i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
            });
          })
        }
        </Notice>

        <div className="row">
          <div className="col-md-12">
            <CustomHead
              beforeCodeTitle={this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1) +" Model"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                    <Link to={"/admin/"+this.state.type+"/model"} className="btn btn-clean btn-icon-sm">
                      <i className="la la-long-arrow-left"></i>
                      Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            }>
              <div className="kt-section">
                <Create data={this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(CreatePage);