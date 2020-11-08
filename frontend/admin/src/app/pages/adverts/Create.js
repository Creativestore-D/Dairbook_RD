import React from "react";
import Notice from "../../partials/content/Notice";
import CustomHead from "../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button as ButtonCore,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, post, SECTIONS} from "../../crud/api";
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
import Select from 'react-select';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import blue from "@material-ui/core/colors/blue";
import moment from "moment";

const defaultMaterialTheme = createMuiTheme({
    palette: {
        primary: blue,
    },
    props: {
        MuiInput: {
            disableUnderline: true,
        },
        MuiTextField: {
            style: {
                display: "block",
            },
        },
        MuiInputBase: {
            style: {
                display: "block",
            },
            disableUnderline: true,
            inputProps: {
                style: {
                    display: "block",
                    height: "calc(1.5em + 1.3rem + 2px)",
                    padding: "0.65rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                    color: "#495057",
                    backgroundColor: "#fff",
                    backgroundClip: "padding-box",
                    border: "1px solid #e2e5ec",
                    borderRadius: "4px",
                    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    boxSizing: "border-box",
                }
            }
        },
    },
});

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adverts: {is_active: 0, start_date: moment(new Date).format("YYYY-MM-DD"),end_date: moment(new Date).format("YYYY-MM-DD")},
            validated: false,
            action: '',
            section: {label: 'Select Section', value: 0},
            users: [],
            user: {label: 'Select User', value: 0},
            selectedFile: null,
            previewFile: null,
            startDate: new Date(),
            endDate: new Date(),
        };
        this.loadModels();
    }

    loadModels() {
        let models = {
            'AbUsers': {},
        }
        post('abmodels', {models: models}).then(function (response) {
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    if (opt === 'AbContacts' || opt === 'AbUsers')
                        row.name = row.first_name + ' ' + row.last_name;

                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;
                })
            }
            this.setState({
                users: response.data.AbUsers,
            })
        }.bind(this))
    }

    selectUser(value, key) {
        let adverts = this.state.adverts;
        adverts.user = value && value.value ? value.value : '';

        this.setState({[key]: value ? value : '', adverts: adverts});
    }

    selectSection(value, key) {
        let adverts = this.state.adverts;
        adverts.section = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', adverts: adverts});
    }

    handleChange(event, type) {
        var adverts = this.state.adverts;
        if (type !== 'start_date' && type !== 'end_date') {
            var attr = event.target.name;
            var val = event.target.value;
        } else {
            var attr = type;
            var val = moment(event).format("YYYY-MM-DD");
            if (type === 'start_date') {
                this.setState({startDate: event})
                this.setState({endDate: event})
                adverts['end_date'] = val;
            } else
                this.setState({endDate: event})
        }
        if (attr === 'is_active')
            val = parseInt(val);
        adverts[attr] = val;
        this.setState({adverts: adverts})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        post('advertisements', this.state.adverts).then(
            (response) => {
                this.setState({adverts: response.data});
                this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm('adverts-form') : "/admin/adverts");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    fileChangedHandler = (event) => {
        let adverts = this.state.adverts;
        let file = event.target.files[0];
        this.setState({
            previewFile: URL.createObjectURL(file)
        });
        if (file != undefined) {
            file.size_c = file.size / 1024;

            if ((file.size_c) / 1024 > 2) {
                file.size_c = (file.size_c / 1024).toFixed(2) + ' MB';
                file.error = "Error: File is too big";
                adverts.file = {};
                this.setState({selectedFile: file});
            } else {
                file.error = null;
                file.size_c = file.size_c.toFixed(2) + ' KB';
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    adverts.file = reader.result;
                    this.setState({selectedFile: file, adverts: adverts});
                };
            }
        }
    }
    handleFileRemove = (event) => {
        let adverts = this.state.adverts;
        delete adverts.file;
        this.setState({selectedFile: null, adverts: adverts})
        document.getElementById('adverts-image-upload').value = '';
    }
    clearForm = (id) => {
        document.getElementById(id).reset();
        this.setState({selectedFile: null, previewFile: null});
    }

    render() {
        const {adverts, section, selectedFile, user, users, startDate, endDate} = this.state;
        return (
            <Form
                noValidate
                id="adverts-form"
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>User *</Form.Label>
                        <Select
                            required
                            value={user}
                            name="user_id"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectUser(e, 'user')}
                            options={users}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Start Date</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    format="dd/MM/yyyy"
                                    minDate={new Date()}
                                    disablePast={true}
                                    name="start_date"
                                    value={startDate}
                                    onChange={e => this.handleChange(e, 'start_date')}
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Expiry Date</Form.Label>
                        <ThemeProvider theme={defaultMaterialTheme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    format="dd/MM/yyyy"
                                    minDate={startDate ? startDate : new Date()}
                                    disablePast={true}
                                    name="end_date"
                                    value={endDate}
                                    onChange={e => this.handleChange(e, 'end_date')}
                                />
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Section</Form.Label>
                        <Select
                            value={section}
                            model="adverts"
                            name="section"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectSection(e, 'section')}
                            options={SECTIONS}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <input
                            accept="image/*"
                            style={{display: 'none'}}
                            type="file"
                            id="adverts-image-upload"
                            name="image"
                            onChange={this.fileChangedHandler}
                        />
                        <br/>
                        <label htmlFor="adverts-image-upload">
                            <ButtonCore variant="outlined" color="inherit" component="span">
                                Select Image
                                <CloudUploadIcon style={{marginLeft: '5px'}}/>
                            </ButtonCore>
                        </label>
                        <div className="form-group form-group-last row">
                            <div className="col-12 col-md-4">
                                <div className="dropzone dropzone-multi" id="kt_dropzone_5">
                                    <div className="dropzone-items" style={{display: selectedFile ? 'block' : 'none'}}>
                                        <div className="dropzone-item">
                                            <div className="dropzone-file">
                                                {this.state.previewFile &&
                                                <div style={{'maxWidth': '250px'}}><img style={{width: "100%"}}
                                                                                        src={this.state.previewFile}/>
                                                </div>
                                                }
                                                <div className="dropzone-filename" title="some_image_file_name.jpg">
                                                    <span
                                                        data-dz-name>{selectedFile ? selectedFile.name : 'No file selected'}</span>
                                                    <strong>(<span
                                                        data-dz-size>{selectedFile && selectedFile.size_c ? selectedFile.size_c : ''}</span>)</strong>
                                                </div>
                                                <div className="dropzone-error"
                                                     data-dz-errormessage>{selectedFile && selectedFile.error ? selectedFile.error : ''}</div>
                                            </div>
                                            <div className="dropzone-toolbar">
                                                <span onClick={(e) => this.handleFileRemove(e)}
                                                      className="dropzone-delete" data-dz-remove><i
                                                    className="flaticon2-cross"></i></span>
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
                                value={adverts.is_active === 1 ? '1' : '0'}
                                onChange={e => this.handleChange(e)}
                            >
                                <FormControlLabel className="col-md-2" value="1" control={<Radio/>} label="Publish"/>
                                <FormControlLabel className="col-md-2" value="0" control={<Radio/>} label="Inactive"/>
                            </RadioGroup>
                        </FormControl>
                    </Form.Group>
                </Form.Row>
                <Button type="submit" onClick={(e) => this.setState({action: 'save'})} className="btn btn-primary">
                    <i className="la la-save"/>
                    Save & Close
                </Button>
                &nbsp;&nbsp;

                <Button type="submit" onClick={(e) => this.setState({action: 'save_new'})} className="btn btn-success">
                    <i className="la la-save"/>
                    Save & New
                </Button>
                &nbsp;&nbsp;

                <Link to={"/admin/adverts"} className="btn btn-danger">
                    <i className="la la-remove"/>
                    Cancel
                </Link>
            </Form>
        );
    }
}

class CreatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {errors: {}, showError: false};
        this.sendError = this.sendError.bind(this);
    }

    sendError(error) {
        if (Object.keys(error).length)
            this.setState({showError: true});

        this.setState({errors: error});
    }

    render() {
        return (
            <>
                <Notice icon="flaticon-warning kt-font-primary"
                        style={{display: this.state.showError ? 'flex' : 'none'}}>
                    {
                        Object.keys(this.state.errors).map((key, index) => {
                            return this.state.errors[key].map((error, i) => {
                                return <li key={index + i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
                            });
                        })
                    }
                </Notice>

                <div className="row">
                    <div className="col-md-12">
                        <CustomHead
                            beforeCodeTitle={"Adverts"}
                            jsCode={<div className="kt-portlet__head-toolbar">
                                <div className="kt-portlet__head-wrapper">
                                    <div className="kt-portlet__head-actions">
                                        <div className="dropdown dropdown-inline">
                                            <Link to={"/admin/adverts"} className="btn btn-clean btn-icon-sm">
                                                <i className="la la-long-arrow-left"></i>
                                                Back
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }>
                            <div className="kt-section">
                                <Create data={this.props} sendError={this.sendError}/>
                            </div>
                        </CustomHead>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(CreatePage);