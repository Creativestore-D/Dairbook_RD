import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import { Button, Form, Col} from "react-bootstrap";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl, Button as ButtonCore,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import { list, patch, MEDIA_URL } from "../../../crud/api";
import Select from 'react-select';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";



class Edit extends React.Component {
  constructor(props) {
    super(props);

    const { category_id, type } = this.props.data.match.params
    this.state = { 
      validated: false, 
      category:{}, 
      type: type,
      selectedFile: null,
      previewFile: null,
    };

    this.getCategory(category_id);
  }

  getCategory(category_id) {
    list('category/'+category_id+'/').then(
      (response) => {
          delete response.data.type;
          this.setState({category : response.data, previewFile: response.data.media ? MEDIA_URL+response.data.media.original_file_name : null})
          this.setSelectfile();
    });
  }

  handleChange(event) {
    var category = this.state.category;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    category[attr] = val;
    this.setState({category : category})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    patch('category/'+this.state.category.id+'/', this.state.category).then(
      (response) => {
        delete response.data.type;
        this.setState({category : response.data});
        this.props.data.history.push("/admin/"+this.state.type+"/category");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  setSelectfile() {
    if(this.state.category.media) {
      let file = {};
      let filename_pieces = this.state.category.media.original_file_name.split('/');
      file.name_c = filename_pieces[filename_pieces.length - 1];
      this.setState({ selectedFile: file});
    }
  }

  fileChangedHandler = (event) => {
    let file = event.target.files[0];
    this.setState({
      previewFile: URL.createObjectURL(file)
    });
    if(file != undefined) {
      file.name_c = file.name;
      let category = this.state.category;
      file.size_c = file.size/1024;

      if((file.size_c)/1024 > 2) {
        file.size_c = (file.size_c/1024).toFixed(2) + ' MB';
        file.error = "Error: File is too big";
        category.file = {};
        this.setState({selectedFile:file});
      } else {
        file.error = null;
        file.size_c = file.size_c.toFixed(2)+' KB';
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          category.file = reader.result;
          this.setState({ selectedFile: file, category:category });
        };
      }
    }
  }

  handleFileRemove = (event) => {
    let category = this.state.category;
    delete category.file
    this.setState({selectedFile:null, category:category, previewFile: null})
    document.getElementById('category-image-upload').value = '';
  }

  render() {
    const { validated, category, selectedFile} = this.state;
    return (
      <Form
        noValidate
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="12">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="category"
              name="name"
              defaultValue={category ? category.name:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="12">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows="3" 
              required
              placeholder=""
              model="category"
              name="description"
              defaultValue={category ? category.description:''}
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
                  id="category-image-upload"
                  name= "image"
                  onChange={this.fileChangedHandler}
                />
                <br />
                <label htmlFor="category-image-upload">
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
                            <span data-dz-name>{selectedFile ? selectedFile.name_c : 'No file selected'}</span> <strong>{selectedFile && selectedFile.size_c ? '('+selectedFile.size_c+')' : ''}</strong>
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
                value={category.is_active === 1 ? '1' : '0'}
                onChange={e => this.handleChange(e)}
              >
                <FormControlLabel className="col-md-2" value="1" control={<Radio />} label="Publish" />
                <FormControlLabel className="col-md-2" value="0" control={<Radio />} label="Inactive" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
        </Form.Row>
        <Button type="submit" className="btn btn-primary">
          <i className="la la-save" />
          Update
        </Button>
        &nbsp;&nbsp;
        <Link to={"/admin/"+this.state.type+"/category"} className="btn btn-danger">
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
    this.state = {errors:{}, showError:false, type:props.match.params.type};
    this.sendError = this.sendError.bind(this);
  }

  sendError(error) {
    if(Object.keys(error).length)
      this.setState({showError:true});

    this.setState({errors:error});
  }

  render() {
    
    // const { Formik } = formik;
    const buttons = <Link to={"/admin/"+this.state.type+"/category"} className="btn btn-clean btn-icon-sm">
                      <i className="la la-long-arrow-left"></i>
                      Back
                    </Link>
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
              beforeCodeTitle={this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1) + ' Category'}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  {buttons}
                  </div>
                </div>
              </div>
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