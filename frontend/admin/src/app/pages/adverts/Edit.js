import React from "react";
import Notice from "../../partials/content/Notice";
import CustomHead from "../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl, Button as ButtonCore,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, MEDIA_URL, patch, post, SECTIONS} from "../../crud/api";
import Select from 'react-select';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
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

class Edit extends React.Component {
    constructor(props) {
        super(props);

        const {advert_id} = this.props.data.match.params
        this.state = {
            validated: false,
            adverts: {id: advert_id},
            section: {label: 'Select Section', value: 'Select Section'},
            selectedFile: null,
            previewFile: null,
            users: [],
            user: {label: 'Select User', value: 0},
            //startDate: new Date(),
            //endDate: new Date(),
        };
        this.getAdverts(advert_id);
    }

    getUsers() {
        let filter = {'groups__name': 'user', 'is_active': 1, records: 'all'};
        let adverts = this.state.adverts;
        list('users', filter).then(function (response) {
            let data = response.data;
            for (let opt in data) {
                data[opt].label = data[opt].contact.first_name + ' ' + data[opt].contact.last_name;
                data[opt].value = data[opt].id;
                if (adverts.user && data[opt].id === adverts.user.id) {
                    let user = {label: data[opt].label, value: data[opt].id};
                    adverts.user = adverts.user.id;
                    this.setState({user: data[opt], adverts: adverts})
                }
            }
            this.setState({users: data});
        }.bind(this));
    }

    selectSection(value, key) {
        let adverts = this.state.adverts;
        adverts.section = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', adverts: adverts});
    }

    selectUser(value, key) {
        let adverts = this.state.adverts;
        adverts.user = value && value.value ? value.value : '';
        this.setState({[key]: value ? value : '', adverts: adverts});
    }

    getAdverts(advert_id) {
        list('advertisements/' + advert_id + '/').then(
            (response) => {
                let section = this.state.section;
                //let user = this.state.user;

                SECTIONS.map((index) => {
                    if (index.label === response.data.section) {
                        section = {label: index.label, value: index.value};
                        response.data.section = index.value;
                    }
                });
                this.setState({
                    adverts: response.data,
                    section: section,
                    //startDate: moment(response.data.start_date, 'YYYY-MM-DD'),
                    //endDate: moment(response.data.end_date, 'YYYY-MM-DD'),
                    previewFile: response.data.media ? MEDIA_URL + response.data.media.original_file_name : null
                });
                this.loadModels();
                this.setSelectfile();
            });
    }

    loadModels() {
        let adverts_data = this.state.adverts;
        let models = {
            'AbUsers': {},
        }
        let state_endpoints = {
            AbUsers: ['user'],
        }
        post('abmodels', {models: models}).then(function (response) {
        	let newStates = {};
            for (let opt in response.data) {
                response.data[opt].map((row, i) => {
                    if (opt === 'AbContacts' || opt === 'AbUsers')
                        row.name = row.first_name + ' ' + row.last_name;

                    if (opt === 'AbUsers')
                        row.id = row.user_id;

                    response.data[opt][i].label = row.name;
                    response.data[opt][i].value = row.id;

                    Object.keys(state_endpoints).map((key, i) => {
                      state_endpoints[key].map((state, index) => {
                            if(opt === key && adverts_data[state] !== null && adverts_data[state].id !== undefined && adverts_data[state].id === row.id)
                              newStates[state] = row;
                      })
                    })
                })
            }
            newStates['users'] = response.data.AbUsers;
            this.setState(newStates);
        }.bind(this))
    }

    setSelectfile() {
        if (this.state.adverts.media) {
            let file = {};
            let filename_pieces = this.state.adverts.media.original_file_name.split('/');
            file.name_c = filename_pieces[filename_pieces.length - 1];
            this.setState({selectedFile: file});
        }
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
        this.checkDataFormat(); // this is done to convert foregin table objects into pk
        patch('advertisements/' + this.state.adverts.id + '/', this.state.adverts).then(
            (response) => {
                this.setState({adverts: response.data});
                this.props.data.history.push("/admin/adverts");
            }).catch(error => {
            this.props.sendError(error.response.data);
        });
    }

    checkDataFormat() {
      let adverts = this.state.adverts;
      let related_data = ['user'];
      related_data.map((val, i) => {
        adverts[val] = this.state[val].value;
      })
      this.setState({adverts:adverts});
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

    render() {
        const {adverts, section, selectedFile, user, users, startDate, endDate} = this.state;
        {
            console.log('users ', users)
        }
        // {console.log('user ',user)}
        return (
            <Form
                noValidate
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
                                    name="start_date"
                                    value={adverts.start_date}
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
                                    minDate={startDate ? startDate : adverts.end_date}
                                    disablePast={true}
                                    name="end_date"
                                    value={endDate ? endDate : adverts.end_date}
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
                        {console.log(section, '2nd')}
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
                                                <div style={{'max-width': '250px'}}><img style={{width: "100%"}}
                                                                                         src={this.state.previewFile}/>
                                                </div>
                                                }
                                                <div className="dropzone-filename" title="some_image_file_name.jpg">
                                                    <span
                                                        data-dz-name>{selectedFile ? selectedFile.name_c : 'No file selected'}</span>
                                                    <strong><span
                                                        data-dz-size>{selectedFile && selectedFile.size_c ? '(' + selectedFile.size_c + ')' : ''}</span></strong>
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
                <Button type="submit" className="btn btn-primary">
                    <i className="la la-save"/>
                    Update
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

class EditPage extends React.Component {
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

        // const { Formik } = formik;
        const buttons = <Link to={"/admin/adverts"} className="btn btn-clean btn-icon-sm">
            <i className="la la-long-arrow-left"></i>
            Back
        </Link>
        return (
            <>
                <Notice icon="flaticon-warning kt-font-primary"
                        style={{display: this.state.showError ? 'flex' : 'none'}}>
                    {
                        Object.keys(this.state.errors).map((key, index) => {
                            return this.state.errors[key].map((error, i) => {
                                console.log(error);
                                return <li key={index + i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
                            });
                        })
                    }
                </Notice>

                <div className="row">
                    <div className="col-md-12">
                        <CustomHead
                            beforeCodeTitle={'Adverts'}
                            jsCode={<div className="kt-portlet__head-toolbar">
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
                                <Edit data={this.props} sendError={this.sendError}/>
                            </div>
                        </CustomHead>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(EditPage);