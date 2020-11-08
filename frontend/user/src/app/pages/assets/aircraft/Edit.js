import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Form, Col, Tab, Tabs, Modal, Navbar, Nav, Row} from "react-bootstrap";
import {
    Checkbox,
    FormControlLabel, FormGroup,
    FormControl, Button as ButtonCore, IconButton, Select as SelectCore, Divider,
} from "@material-ui/core";
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
import {Link, withRouter} from 'react-router-dom'
import {
    list,
    del,
    patch,
    post,
    getToken,
    MEDIA_URL,
    API_URL,
    AIRCRAFT_STATUSES,
    AIRCRAFT_COMPLIANCE,
    AIRCRAFT_OFFER,
    COMMERCIAL_EXTRA_FIELDS, AIRCRAFT_EXTRA_FIELDS, USER_URL
} from "../../../crud/api";
import Select from 'react-select';
import DateFnsUtils from '@date-io/date-fns';
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import 'react-upload-gallery/dist/style.scss' // or css
import {render} from 'react-dom';
import Gallery from 'react-grid-gallery';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import MediaLibrary from '../../../library/media';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import KTWizard from "../../../../_metronic/_assets/js/wizard";
import DeleteIcon from "@material-ui/icons/Delete";
import {forEach} from "react-bootstrap/cjs/ElementChildren";

const defaultMaterialTheme = createMuiTheme({
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

class Edit extends React.Component {

    wizardRef = React.createRef();

    constructor(props) {
        super(props);
        const {aircraft_id, type} = this.props.data.match.params;
        this.medialibraryAsset = React.createRef();

        this.state = {
            validated: false,
            aircraft: {},
            selectedFile: null,
            category: [],
            manufacturer: [],
            countries: [],
            contacts: [],
            type: [],
            model: [],
            engine_type: [],
            engine_model: [],
            engine_manufacturer: [],
            companies: [],
            configuration: [],
            users: [],
            search: '',
            selected_primary_contact: {value: ''},
            selected_category: {value: ''},
            selected_type: {value: ''},
            selected_engine_type: {value: ''},
            selected_manufacturer: {value: ''},
            selected_engine_manufacturer: {value: ''},
            selected_current_location: {value: ''},
            selected_model: {value: ''},
            selected_engine_model: {value: ''},
            selected_owner: {value: ''},
            selected_current_operator: {value: ''},
            selected_previous_operator: {value: ''},
            selected_manager: {value: ''},
            selected_seller: {value: ''},
            selected_configuration: {value: ''},
            selected_user: {value: ''},
            selected_status: {value: ''},
            selected_compliance: {value: ''},
            selected_offer_for: {value: ''},
            selected_registration_country: {value: ''},
            selected_images: [],
            yom: new Date(),
            attachments: [],
            initialFiles: [],
            modalDisplay: false,
            modalType: '',
            airFrameOnly: false,
            commercialExtraFields: COMMERCIAL_EXTRA_FIELDS,
            selectedExtraFields: [],
            aircraftExtraFields: AIRCRAFT_EXTRA_FIELDS,
            selectedExtraFieldsAircraft: [],
            fields: {},
            errorsf: {}
        };
        this.getAircraft(aircraft_id);
    }

    componentDidMount() {
        new KTWizard(this.wizardRef.current);
    }

    getAircraft(aircraft_id) {
        list('aircrafts/' + aircraft_id + '/').then(
            (response) => {
                let availability = response.data.availability;
                this.setState({
                    aircraft: response.data,
                    yom: moment(response.data.yom, 'YYYY'),
                    availability: availability
                })
                // this.getDropdownsListing();
                this.loadModels();

                this.loadSelectedImages(response.data.media);
                this.loadInitialFields();
                this.renderExtraFields();
            });
    }

    handleChange(event, type) {
        var aircraft = this.state.aircraft;
        if (type !== 'yom' && type !== 'availability' && type !== 'last_c_check') {
            var attr = event.target.name;
            var val = event.target.value;
        } else if (type == 'yom') {
            var attr = type;
            var val = moment(event).format("YYYY");
            this.setState({yom: event})
        } else {
            var attr = type;
            var val = moment(event).format();
            this.setState({
                availability: (type === 'availability') ? event : this.state.availability,
                last_c_check: (type === 'last_c_check') ? event : this.state.last_c_check
            })
        }
        if (attr === 'is_active')
            val = parseInt(val);

        aircraft[attr] = val;
        this.setState({aircraft: aircraft})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        this.checkDataFormat(); // this is done to convert foregin table objects into pk
        if (!this.state.selectedFile)
            delete this.state.aircraft.file;
        if (this.handleValidation()) {
            patch('aircrafts/' + this.state.aircraft.id + '/', this.state.aircraft).then(
                (response) => {
                    this.setState({aircraft: response.data});
                    this.props.data.history.push(this.state.action == 'save_new' ? "/" + USER_URL + "/aircraft/asset/create" : "/" + USER_URL + "/aircraft/asset");
                }).catch(error => {
                this.props.sendError(error.response.data);
            });
        }
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        let numbersOnly = {
            tsn: 'tsn',
            csn: 'csn',
        }
        let alphaNumberic = {
            msn: 'msn',
        }
        let numbers_only_keys = Object.keys(numbersOnly);
        let alpha_numeric_keys = Object.keys(alphaNumberic);

        for (let key in numbers_only_keys) {
            if (typeof fields[numbers_only_keys[key]] !== "undefined" && fields[numbers_only_keys[key]] !== '') {
                if (!fields[numbers_only_keys[key]].match(/^\d+$/)) {
                    formIsValid = false;
                    errors[numbers_only_keys[key]] = ["Only numbers are allowed."];
                }
            }
        }

        for (let key in alpha_numeric_keys) {
            if (typeof fields[alpha_numeric_keys[key]] !== "undefined" && fields[alpha_numeric_keys[key]] !== '') {
                if (!fields[alpha_numeric_keys[key]].match(/^[a-z0-9]+$/i)) {
                    formIsValid = false;
                    errors[alpha_numeric_keys[key]] = ["Only alphabets and numbers are allowed."];
                }
            }
        }

        this.setState({errorsf: errors}, function () {
            this.props.sendError(this.state.errorsf)
        }.bind(this));
        return formIsValid;
    }

    checkDataFormat() {
        let aircraft = this.state.aircraft;
        let related_data = ['category', 'primary_contact', 'configuration', 'manufacturer', 'current_location',
            'type', 'model', 'owner', 'user', 'current_operator', 'previous_operator', 'manager', 'seller', 'engine_manufacturer',
            'registration_country', 'engine_type', 'engine_model'];
        related_data.map((val, i) => {
            aircraft[val] = this.state['selected_' + val].value;
        })
        aircraft.images = this.state.selected_images;
        aircraft.attachments = this.state.attachments;
        this.setState({aircraft: aircraft});
    }

    loadModels() {
        let aircraft_data = this.state.aircraft;

        // static dropdowns calculation here -

        let static_dropdowns = { // when you have static dropdown like gender just put here
            status: AIRCRAFT_STATUSES,
            compliance: AIRCRAFT_COMPLIANCE,
            offer_for: AIRCRAFT_OFFER
        }

        let dropdown_keys = Object.keys(static_dropdowns);
        for (let key in dropdown_keys) {
            for (let index in static_dropdowns[dropdown_keys[key]]) {
                if (static_dropdowns[dropdown_keys[key]][index].value === aircraft_data[dropdown_keys[key]]) {
                    this.setState({['selected_' + dropdown_keys[key]]: static_dropdowns[dropdown_keys[key]][index]});
                    break;
                }
            }
        }

        let models = {
            'AbUsers': {},
            'AbCategories': {type: 'aircraft'},
            'AbContacts': {},
            'AbConfigurations': {},
            'AbManufacturers': {type: 'engine'},
            'AbCountries': {},
            'AbCompanies': {},
        }

        // lets do some mapping to avoid if else conditions
        let state_endpoints = {
            AbUsers: ['user'],
            AbContacts: ['primary_contact'],
            AbCategories: ['category'],
            AbConfigurations: ['configuration'],
            AbManufacturers: ['engine_manufacturer'],
            AbCountries: ['current_location', 'registration_country'],
            AbCompanies: ['owner', 'current_operator', 'previous_operator', 'manager', 'seller']
        }

        if (aircraft_data.category !== null && aircraft_data.category.id !== undefined) {
            models['AbManufacturers__aircraft'] = {type: 'aircraft', categories__id: aircraft_data.category.id}
            state_endpoints['AbManufacturers__aircraft'] = ['manufacturer']
        }

        if (aircraft_data.manufacturer != null && aircraft_data.manufacturer.id != undefined) {
            models['AbTypes'] = {type: 'aircraft', manufacturer_id: aircraft_data.manufacturer.id}
            state_endpoints['AbTypes'] = ['type']
        }

        if (aircraft_data.type != null && aircraft_data.type.id != undefined) {
            models['AbModels'] = {type: 'aircraft', type_0: aircraft_data.type.id}
            state_endpoints['AbModels'] = ['model']
        }

        if (aircraft_data.engine_manufacturer != null && aircraft_data.engine_manufacturer.id != undefined) {
            models['AbTypes__engine'] = {type: 'engine', manufacturer_id: aircraft_data.engine_manufacturer.id}
            state_endpoints['AbTypes__engine'] = ['engine_type']
        }

        if (aircraft_data.engine_type != null && aircraft_data.engine_type.id != undefined) {
            models['AbModels__engine'] = {type: 'engine', type_0: aircraft_data.engine_type.id}
            state_endpoints['AbModels__engine'] = ['engine_model']
        }

        // if(response.data.type.id != undefined && response.data.type.id != "")
        //   this.setDynamicDropdowns(response.data.engine_manufacturer.id, 'engine_manufacturer');

        // if(response.data.engine_manufacturer.id != undefined && response.data.engine_manufacturer.id != "")
        //   this.setDynamicDropdowns(response.data.engine_type.id, 'engine_type');


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
                            if (opt === key && aircraft_data[state] !== null && aircraft_data[state].id !== undefined && aircraft_data[state].id === row.id)
                                newStates['selected_' + state] = row;

                            if (aircraft_data.engine_type != null && aircraft_data.engine_type.id != undefined)
                                models['AbModels__engine'] = {type: 'engine', type_0: aircraft_data.engine_type.id}
                        })
                    })

                })
            }
            newStates['users'] = response.data.AbUsers;
            newStates['category'] = response.data.AbCategories;
            newStates['contacts'] = response.data.AbContacts;
            newStates['configuration'] = response.data.AbConfigurations;
            newStates['engine_manufacturer'] = response.data.AbManufacturers;
            newStates['countries'] = response.data.AbCountries;
            newStates['companies'] = response.data.AbCompanies;

            if (aircraft_data.category !== null && aircraft_data.category.id !== undefined)
                newStates['manufacturer'] = response.data.AbManufacturers__aircraft;

            if (aircraft_data.manufacturer != null && aircraft_data.manufacturer.id != undefined)
                newStates['type'] = response.data.AbTypes;

            if (aircraft_data.type != null && aircraft_data.type.id != undefined)
                newStates['model'] = response.data.AbModels;

            if (aircraft_data.engine_manufacturer != null && aircraft_data.engine_manufacturer.id != undefined)
                newStates['engine_type'] = response.data.AbTypes__engine;

            if (aircraft_data.engine_type != null && aircraft_data.engine_type.id != undefined)
                newStates['engine_model'] = response.data.AbModels__engine;

            this.setState(newStates);
        }.bind(this))
    }

    removeImage(index) {
        let selected_images = this.state.selected_images;
        selected_images = selected_images.filter((val, i) => {
            return index !== i;
        })
        this.setState({selected_images: selected_images});
    }

    getDropdownsListing() {
        let aircraft_data = this.state.aircraft;
        let dropdowns = {// when you have database dropdown like departments just put here
            category: 'category',
            primary_contact: 'contacts',
            configuration: 'configuration',
            manufacturer: 'manufacturer',
            current_location: 'countries',
            engine_manufacturer: 'engine_manufacturer',
            // type:'type',
            // model:'model',
            owner: 'companies',
            manager: 'companies',
            user: 'users'
        }

        let duplicating_dropdowns = {
            companies: ['current_operator', 'previous_operator', 'manager', 'seller'],
            countries: ['registration_country'],
        }


        // static dropdowns calculation here -

        let static_dropdowns = { // when you have static dropdown like gender just put here
            status: AIRCRAFT_STATUSES,
            compliance: AIRCRAFT_COMPLIANCE,
            offer_for: AIRCRAFT_OFFER
        }

        let dropdown_keys = Object.keys(static_dropdowns);
        for (let key in dropdown_keys) {
            for (let index in static_dropdowns[dropdown_keys[key]]) {
                if (static_dropdowns[dropdown_keys[key]][index].value === aircraft_data[dropdown_keys[key]]) {
                    this.setState({['selected_' + dropdown_keys[key]]: static_dropdowns[dropdown_keys[key]][index]});
                    break;
                }
            }
        }

        dropdown_keys = Object.keys(dropdowns);
        for (let key in dropdown_keys) {
            let params = {}, endpoint = dropdowns[dropdown_keys[key]];
            if (dropdown_keys[key] === 'manufacturer')
                params.type = 'aircraft';
            else if (dropdown_keys[key] === 'engine_manufacturer') {
                endpoint = 'manufacturer';
                params.type = 'engine';
            }
            list(endpoint, params).then(function (response) {
                let data = response.data;
                let selected = {};
                for (let opt in data) {
                    // special case for contacts
                    if (dropdowns[dropdown_keys[key]] === 'contacts')
                        data[opt].name = data[opt].first_name + ' ' + data[opt].last_name;
                    else if (dropdowns[dropdown_keys[key]] === 'users')
                        data[opt].name = data[opt].contact.first_name + ' ' + data[opt].contact.last_name;

                    data[opt].label = data[opt].name;
                    data[opt].value = data[opt].id;

                    if (aircraft_data[dropdown_keys[key]] != undefined && data[opt].id === aircraft_data[dropdown_keys[key]].id)
                        selected = data[opt]

                    if (duplicating_dropdowns[dropdowns[dropdown_keys[key]]] != undefined) {
                        for (let index in duplicating_dropdowns[dropdowns[dropdown_keys[key]]]) {
                            let duplicated_el = duplicating_dropdowns[dropdowns[dropdown_keys[key]]][index];
                            if (aircraft_data[duplicated_el] != undefined && data[opt].id === aircraft_data[duplicated_el].id)
                                this.setState({['selected_' + duplicated_el]: selected});
                        }
                    }
                }
                this.setState({
                    [dropdowns[dropdown_keys[key]]]: data,
                    ['selected_' + dropdown_keys[key]]: selected,
                    aircraft: aircraft_data
                });

            }.bind(this));
        }
    }

    selectChange(value, key) {
        let aircraft = this.state.aircraft;
        aircraft[key] = value.value;
        this.setState({['selected_' + key]: value, aircraft: aircraft});
        this.setDynamicDropdowns(value.id, key);
    }

    setDynamicDropdowns(id, key) {
        if (['category', 'manufacturer', 'type', 'engine_manufacturer', 'engine_type'].indexOf(key) > -1) {
            let endpoint = '', params = {}, key_to_update = '', models = {};
            if (key === 'category') {
                models = {
                    AbManufacturers: {categories__id: id, type: 'aircraft'}
                }
                key_to_update = 'manufacturer';
            } if (key === 'manufacturer') {
                models = {
                    AbTypes: {manufacturer_id: id, type: 'aircraft'}
                }
                key_to_update = 'type';
            } else if (key === 'type') {
                models = {
                    AbModels: {type_0: id, type: 'aircraft'}
                }
                key_to_update = 'model';
            } else if (key === 'engine_manufacturer') {
                models = {
                    AbTypes: {manufacturer_id: id, type: 'engine'}
                }
                key_to_update = 'engine_type';
            } else if (key === 'engine_type') {
                models = {
                    AbModels: {type_0: id, type: 'engine'}
                }
                key_to_update = 'engine_model';
            }

            post('abmodels', {models: models}).then(function (response) {
                let selected = {};
                for (let opt in response.data) {
                    response.data[opt].map((row, i) => {
                        response.data[opt][i].label = row.name;
                        response.data[opt][i].value = row.id;
                        selected = row;
                    })
                    this.setState({
                        [key_to_update]: response.data[opt], ['selected_' + key_to_update]: selected
                    })
                }
            }.bind(this))
        }
    }

    selectYear(val, key) {
        let aircraft = this.state.aircraft;
        aircraft[key] = val;
        this.setState({aircraft: aircraft});
    }

    setTab(event, tab) {
        document.getElementById('aircraft-tabs-tab-' + tab).click();
    }

    loadSelectedImages(data) {
        data.map((val, i) => {
            data[i].src = MEDIA_URL + val.original_file_name;
            data[i].thumbnail = MEDIA_URL + val.original_file_name;
            data[i].thumbnailWidth = 150;
            data[i].thumbnailHeight = 150;
            if (data[i].is_featured) {
                data[i].isSelected = true;
                data[i].tags = [{value: "Featured", title: "Featured"}];
            } else
                data[i].isSelected = false;
            data[i].customOverlay = <Grid item xs={8}> <DeleteForeverOutlinedIcon/> </Grid>
        })
        this.setState({selected_images: data});
    }

    onClickThumbnail(index) {
        let selected_images = this.state.selected_images;
        selected_images.map((val, i) => {
            if (i === index) {
                selected_images[i].is_featured = 1;
                selected_images[i].isSelected = true;
                selected_images[i].tags = [{value: "Featured", title: "Featured"}];
            } else {
                selected_images[i].is_featured = 0;
                selected_images[i].isSelected = false;
                delete selected_images[i].tags;
            }
        })
        this.setState({selected_images: selected_images});
    }

    getUploadParams(data) {
        const body = new FormData()
        body.append('original_file_name', data.file)
        body.append('user', this.state.selected_user.value);
        body.append('attachable_type', 'Aircraft');

        if ('existing' in data.file)
            body.append('existing_id', data.file.id);

        return {url: API_URL + 'attaches', dataType: 'json', body, headers: {'Authorization': 'Token ' + getToken()}}
    }

    onAttachmentUpload(data, status) {
        if (status === 'done') {
            let attachment = JSON.parse(data.xhr.response);
            this.setState({attachments: [...this.state.attachments, attachment]});
        } else if (status === 'removed') {
            let attachment = JSON.parse(data.xhr.response);
            let attachments = this.state.attachments.filter((val, i) => {
                return val.id !== attachment.id
            })
            this.setState({attachments: attachments})
        }
    }

    loadInitialFields() {
        if (this.state.aircraft.attachments !== undefined) {
            let initialFiles = [];
            this.state.aircraft.attachments.map((val, i) => {
                let file = new File(['foo'], MEDIA_URL + val.original_file_name);
                file.id = val.id;
                file.existing = true;
                initialFiles.push(file);
            })
            this.setState({initialFiles: initialFiles});
        }
    }

    renderExtraFields() {
        //first render aircraft extrafields
        let aircraftExtraFields = [...this.state.aircraftExtraFields];
        let aircraftExtra = [];
        AIRCRAFT_EXTRA_FIELDS.map((val, i) => {
            if (this.state.aircraft[val.value])
                aircraftExtra.push('' + val.value + '')
        })

        this.setState({selectedExtraFieldsAircraft: aircraftExtra});
        this.setState(state => {
            const aircraftExtraFields = state.aircraftExtraFields.filter(item => !aircraftExtra.includes(item.value));
            return {
                aircraftExtraFields
            };
        });

        //then render commercial extrafields
        let commercialExtraFields = [...this.state.commercialExtraFields];
        let commercialExtra = [];
        COMMERCIAL_EXTRA_FIELDS.map((val, i) => {
            if (this.state.aircraft[val.value] && typeof this.state.aircraft[val.value].id !== "undefined")
                commercialExtra.push('' + val.value + '')
        })

        this.setState({selectedExtraFields: commercialExtra});
        this.setState(state => {
            const commercialExtraFields = state.commercialExtraFields.filter(item => !commercialExtra.includes(item.value));
            return {
                commercialExtraFields
            };
        });
    }

    selectMoreFields(event, key) {
        let commercialExtraFields = [...this.state.commercialExtraFields];
        commercialExtraFields.splice(event.target.selectedIndex - 1, 1);
        this.setState({commercialExtraFields: commercialExtraFields});
        this.setState(state => {
            const selectedExtraFields = [...state.selectedExtraFields, key];
            return {
                selectedExtraFields,
            };
        });
    }

    removeExtraField(event, key, label) {
        let commercialExtraFields = [...this.state.commercialExtraFields, {label: label, value: key}];
        this.setState({commercialExtraFields: commercialExtraFields});
        let selectedExtraFields = this.state.selectedExtraFields;
        selectedExtraFields = selectedExtraFields.filter((val, i) => {
            return key !== val;
        })
        this.setState({selectedExtraFields: selectedExtraFields});
    }

    selectMoreFieldsAircraft(event, key) {
        let aircraftExtraFields = [...this.state.aircraftExtraFields];
        aircraftExtraFields.splice(event.target.selectedIndex - 1, 1);
        this.setState({aircraftExtraFields: aircraftExtraFields});
        this.setState(state => {
            const selectedExtraFieldsAircraft = [...state.selectedExtraFieldsAircraft, key];
            return {
                selectedExtraFieldsAircraft,
            };
        });
    }

    removeExtraFieldAircraft(event, key, label) {
        let aircraftExtraFields = [...this.state.aircraftExtraFields, {label: label, value: key}];
        this.setState({aircraftExtraFields: aircraftExtraFields});
        let selectedExtraFieldsAircraft = this.state.selectedExtraFieldsAircraft;
        selectedExtraFieldsAircraft = selectedExtraFieldsAircraft.filter((val, i) => {
            return key !== val;
        })
        this.setState({selectedExtraFieldsAircraft: selectedExtraFieldsAircraft});
    }

    handleModalShow(event, type) {
        this.setState({
            modalDisplay: true,
            modalType: type
        })
    }

    handleModalClose = () => {
        this.setState({modalDisplay: false})
    }

    render() {
        const {
            last_c_check, aircraft, availability, selected_manufacturer, manufacturer,
            selected_category, category, selected_current_location, countries, selected_type, type,
            selected_primary_contact, contacts, model, selected_model, selected_registration_country,
            selected_owner, selected_current_operator, selected_previous_operator, companies,
            selected_seller, selected_manager, selected_configuration, configuration,
            selected_engine_model, selected_engine_type, selected_engine_manufacturer, selected_user,
            users, selected_status, selected_compliance, selected_offer_for, yom, initialFiles,
            engine_manufacturer, engine_type, engine_model
        } = this.state;
        return (
            <div className="kt-portlet">
                <div className="kt-portlet__body kt-portlet__body--fit">
                    <div ref={this.wizardRef} className="kt-grid  kt-wizard-v1 kt-wizard-v1--white" id="kt_aircraft_add"
                         data-ktwizard-state="step-first">
                        <div className="kt-grid__item">

                            <div className="kt-wizard-v1__nav">
                                <div className="kt-wizard-v1__nav-items">

                                    <div className="kt-wizard-v1__nav-item" data-ktwizard-type="step"
                                         data-ktwizard-state="current">
                                        <div className="kt-wizard-v1__nav-body">
                                            <div className="kt-wizard-v1__nav-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     xmlnsXlink="http://www.w3.org/1999/xlink" width="24px"
                                                     height="24px" viewBox="0 0 24 24" version="1.1"
                                                     className="kt-svg-icon kt-svg-icon--xl">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24"/>
                                                        <path
                                                            d="M4.875,20.75 C4.63541667,20.75 4.39583333,20.6541667 4.20416667,20.4625 L2.2875,18.5458333 C1.90416667,18.1625 1.90416667,17.5875 2.2875,17.2041667 C2.67083333,16.8208333 3.29375,16.8208333 3.62916667,17.2041667 L4.875,18.45 L8.0375,15.2875 C8.42083333,14.9041667 8.99583333,14.9041667 9.37916667,15.2875 C9.7625,15.6708333 9.7625,16.2458333 9.37916667,16.6291667 L5.54583333,20.4625 C5.35416667,20.6541667 5.11458333,20.75 4.875,20.75 Z"
                                                            fill="#000000" fillRule="nonzero" opacity="0.3"/>
                                                        <path
                                                            d="M2,11.8650466 L2,6 C2,4.34314575 3.34314575,3 5,3 L19,3 C20.6568542,3 22,4.34314575 22,6 L22,15 C22,15.0032706 21.9999948,15.0065399 21.9999843,15.009808 L22.0249378,15 L22.0249378,19.5857864 C22.0249378,20.1380712 21.5772226,20.5857864 21.0249378,20.5857864 C20.7597213,20.5857864 20.5053674,20.4804296 20.317831,20.2928932 L18.0249378,18 L12.9835977,18 C12.7263047,14.0909841 9.47412135,11 5.5,11 C4.23590829,11 3.04485894,11.3127315 2,11.8650466 Z M6,7 C5.44771525,7 5,7.44771525 5,8 C5,8.55228475 5.44771525,9 6,9 L15,9 C15.5522847,9 16,8.55228475 16,8 C16,7.44771525 15.5522847,7 15,7 L6,7 Z"
                                                            fill="#000000"/>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="kt-wizard-v1__nav-label">
                                                Basic
                                            </div>
                                        </div>
                                    </div>
                                    <div className="kt-wizard-v1__nav-item" data-ktwizard-type="step">
                                        <div className="kt-wizard-v1__nav-body">
                                            <div className="kt-wizard-v1__nav-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     xmlnsXlink="http://www.w3.org/1999/xlink" width="24px"
                                                     height="24px" viewBox="0 0 24 24" version="1.1"
                                                     className="kt-svg-icon kt-svg-icon--xl">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24"/>
                                                        <path
                                                            d="M11,20 L11,17 C11,16.4477153 11.4477153,16 12,16 C12.5522847,16 13,16.4477153 13,17 L13,20 L15.5,20 C15.7761424,20 16,20.2238576 16,20.5 C16,20.7761424 15.7761424,21 15.5,21 L8.5,21 C8.22385763,21 8,20.7761424 8,20.5 C8,20.2238576 8.22385763,20 8.5,20 L11,20 Z"
                                                            fill="#000000" opacity="0.3"/>
                                                        <path
                                                            d="M3,5 L21,5 C21.5522847,5 22,5.44771525 22,6 L22,16 C22,16.5522847 21.5522847,17 21,17 L3,17 C2.44771525,17 2,16.5522847 2,16 L2,6 C2,5.44771525 2.44771525,5 3,5 Z M4.5,8 C4.22385763,8 4,8.22385763 4,8.5 C4,8.77614237 4.22385763,9 4.5,9 L13.5,9 C13.7761424,9 14,8.77614237 14,8.5 C14,8.22385763 13.7761424,8 13.5,8 L4.5,8 Z M4.5,10 C4.22385763,10 4,10.2238576 4,10.5 C4,10.7761424 4.22385763,11 4.5,11 L7.5,11 C7.77614237,11 8,10.7761424 8,10.5 C8,10.2238576 7.77614237,10 7.5,10 L4.5,10 Z"
                                                            fill="#000000"/>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="kt-wizard-v1__nav-label">
                                                Aircraft
                                            </div>
                                        </div>
                                    </div>
                                    <div className="kt-wizard-v1__nav-item" data-ktwizard-type="step">
                                        <div className="kt-wizard-v1__nav-body">
                                            <div className="kt-wizard-v1__nav-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     xmlnsXlink="http://www.w3.org/1999/xlink" width="24px"
                                                     height="24px" viewBox="0 0 24 24" version="1.1"
                                                     className="kt-svg-icon kt-svg-icon--xl">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24"/>
                                                        <path
                                                            d="M13,18.9450712 L13,20 L14,20 C15.1045695,20 16,20.8954305 16,22 L8,22 C8,20.8954305 8.8954305,20 10,20 L11,20 L11,18.9448245 C9.02872877,18.7261967 7.20827378,17.866394 5.79372555,16.5182701 L4.73856106,17.6741866 C4.36621808,18.0820826 3.73370941,18.110904 3.32581341,17.7385611 C2.9179174,17.3662181 2.88909597,16.7337094 3.26143894,16.3258134 L5.04940685,14.367122 C5.46150313,13.9156769 6.17860937,13.9363085 6.56406875,14.4106998 C7.88623094,16.037907 9.86320756,17 12,17 C15.8659932,17 19,13.8659932 19,10 C19,7.73468744 17.9175842,5.65198725 16.1214335,4.34123851 C15.6753081,4.01567657 15.5775721,3.39010038 15.903134,2.94397499 C16.228696,2.49784959 16.8542722,2.4001136 17.3003976,2.72567554 C19.6071362,4.40902808 21,7.08906798 21,10 C21,14.6325537 17.4999505,18.4476269 13,18.9450712 Z"
                                                            fill="#000000" fillRule="nonzero"/>
                                                        <circle fill="#000000" opacity="0.3" cx="12" cy="10" r="6"/>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="kt-wizard-v1__nav-label">
                                                Commercial
                                            </div>
                                        </div>
                                    </div>
                                    <div className="kt-wizard-v1__nav-item" data-ktwizard-type="step">
                                        <div className="kt-wizard-v1__nav-body">
                                            <div className="kt-wizard-v1__nav-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     xmlnsXlink="http://www.w3.org/1999/xlink" width="24px"
                                                     height="24px" viewBox="0 0 24 24" version="1.1"
                                                     className="kt-svg-icon kt-svg-icon--xl">
                                                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <rect x="0" y="0" width="24" height="24"/>
                                                        <path
                                                            d="M13.2070325,4 C13.0721672,4.47683179 13,4.97998812 13,5.5 C13,8.53756612 15.4624339,11 18.5,11 C19.0200119,11 19.5231682,10.9278328 20,10.7929675 L20,17 C20,18.6568542 18.6568542,20 17,20 L7,20 C5.34314575,20 4,18.6568542 4,17 L4,7 C4,5.34314575 5.34314575,4 7,4 L13.2070325,4 Z"
                                                            fill="#000000"/>
                                                        <circle fill="#000000" opacity="0.3" cx="18.5" cy="5.5"
                                                                r="2.5"/>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="kt-wizard-v1__nav-label">
                                                Complete
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v1__wrapper">

                            <Form className="kt-form" noValidate id="create-aircraft-form "
                                  onSubmit={e => this.handleSubmit(e)}>

                                <div className="kt-wizard-v1__content" data-ktwizard-type="step-content"
                                     data-ktwizard-state="current">
                                    <div className="kt-heading kt-heading--md">Basic Info</div>
                                    <div className="kt-section kt-section--first">
                                        <div className="kt-wizard-v1__form">
                                            <Form.Row>
                                                <Form.Group as={Col} md="4" xs="12">
                                                    <Form.Label>Category</Form.Label>
                                                    <Select
                                                        value={selected_category}
                                                        model="category"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'category')}
                                                        options={category}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} md="4" xs="12">
                                                    <Form.Label>Manufacturer</Form.Label>
                                                    <Select
                                                        value={selected_manufacturer}
                                                        model="manufacturer"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'manufacturer')}
                                                        options={manufacturer}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} md="4" xs="12">
                                                    <Form.Label>Type</Form.Label>
                                                    <Select
                                                        value={selected_type}
                                                        model="type"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'type')}
                                                        options={type}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} md="4" xs="12">
                                                    <Form.Label>Model</Form.Label>
                                                    <Select
                                                        value={selected_model}
                                                        model="model"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'model')}
                                                        options={model}
                                                    />
                                                </Form.Group>
                                            </Form.Row>
                                            <div>
                                                <Link href="#" onClick={(e) => this.handleModalShow(e, 'aircraft')}>
                                                    Didn't find basic info? Please click here to suggest.
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-wizard-v1__content" data-ktwizard-type="step-content">
                                    <div className="kt-heading kt-heading--md">Aircraft & Engine Info</div>
                                    <div className="kt-section kt-section--first">
                                        <div className="kt-wizard-v1__form">

                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">MSN</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder=""
                                                        model="aircraft"
                                                        name="msn"
                                                        defaultValue={aircraft ? aircraft.msn : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">YOM</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <ThemeProvider theme={defaultMaterialTheme}>
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <DatePicker
                                                                views={["year"]}
                                                                minDate={new Date('1990')}
                                                                name="yom"
                                                                value={yom}
                                                                onChange={e => this.handleChange(e, 'yom')}
                                                            />
                                                        </MuiPickersUtilsProvider>
                                                    </ThemeProvider>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">Configuration</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Select
                                                        value={selected_configuration}
                                                        model="current_configuration"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'configuration')}
                                                        options={configuration}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">Seating</Form.Label>
                                                <Col sm="9" lg="6" className="d-flex">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder="Y (Economy)"
                                                        model="aircraft"
                                                        className="mr-1"
                                                        name="seating_first_class"
                                                        defaultValue={aircraft ? aircraft.seating_first_class : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />

                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder="Y (Business)"
                                                        model="aircraft"
                                                        className="mr-1"
                                                        name="seating_business"
                                                        defaultValue={aircraft ? aircraft.seating_business : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />

                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder="Y (First Class)"
                                                        model="aircraft"
                                                        className="mr-1"
                                                        name="seating_economy"
                                                        defaultValue={aircraft ? aircraft.seating_economy : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">Status</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Select
                                                        value={selected_status}
                                                        model="aircraft"
                                                        name="status"
                                                        onChange={e => this.selectChange(e, 'status')}
                                                        options={AIRCRAFT_STATUSES}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            {this.state.selectedExtraFieldsAircraft.includes("compliance") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">Compliance</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Select
                                                        value={selected_compliance}
                                                        model="aircraft"
                                                        name="compliance"
                                                        onChange={e => this.selectChange(e, 'compliance')}
                                                        options={AIRCRAFT_COMPLIANCE}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraFieldAircraft(e, 'compliance', 'Compliance')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFieldsAircraft.includes("tsn") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">TSN</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder=""
                                                        model="aircraft"
                                                        name="tsn"
                                                        defaultValue={aircraft ? aircraft.tsn : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraFieldAircraft(e, 'tsn', 'TSN')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFieldsAircraft.includes("csn") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">CSN</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder=""
                                                        model="aircraft"
                                                        name="csn"
                                                        defaultValue={aircraft ? aircraft.csn : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraFieldAircraft(e, 'csn', 'CSN')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFieldsAircraft.includes("mtow") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">MTOW
                                                    Kg</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder=""
                                                        model="aircraft"
                                                        name="mtow"
                                                        defaultValue={aircraft ? aircraft.mtow : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraFieldAircraft(e, 'mtow', 'MTOW Kg')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFieldsAircraft.includes("mlgw") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">MLGW
                                                    Kg</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder=""
                                                        model="aircraft"
                                                        name="mlgw"
                                                        defaultValue={aircraft ? aircraft.mlgw : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraFieldAircraft(e, 'mlgw', 'MLGW Kg')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFieldsAircraft.includes("last_c_check") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">Last C
                                                    Check</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <ThemeProvider theme={defaultMaterialTheme}>
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <DatePicker
                                                                required
                                                                minDate={new Date('1990-01-01')}
                                                                value={last_c_check}
                                                                format="dd/MM/yyyy"
                                                                onChange={e => this.handleChange(e, 'last_c_check')}
                                                                animateYearScrolling
                                                            />
                                                        </MuiPickersUtilsProvider>
                                                    </ThemeProvider>
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraFieldAircraft(e, 'last_c_check', 'Last C Check')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFieldsAircraft.includes("registration_number") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">Registration
                                                    Number</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder=""
                                                        model="aircraft"
                                                        name="registration_number"
                                                        defaultValue={aircraft ? aircraft.registration_number : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraFieldAircraft(e, 'registration_number', 'Registration Number')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFieldsAircraft.includes("registration_country") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">Registration
                                                    Country</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Select
                                                        value={selected_registration_country}
                                                        model="registration_country"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'registration_country')}
                                                        options={countries}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraFieldAircraft(e, 'registration_country', 'Registration Country')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"></Form.Label>
                                                <Col sm="9" lg="6">
                                                    <FormControl variant="outlined" fullWidth={true}>
                                                        <SelectCore
                                                            native
                                                            value=""
                                                            onChange={(e) => this.selectMoreFieldsAircraft(e, e.target.value)}
                                                        >
                                                            <option value="" disabled>Add more fields</option>
                                                            {this.state.aircraftExtraFields.map(item => (
                                                                <option value={item.value}
                                                                        data-label={item.label}>{item.label}</option>
                                                            ))}
                                                        </SelectCore>
                                                    </FormControl>
                                                </Col>
                                            </Form.Group>

                                            <div className="kt-space-10"></div>
                                            <Divider variant="middle"/>
                                            <div className="kt-space-10"></div>
                                            <Form.Row>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            onChange={(e) => this.handleAirFrameChange(e)}
                                                            value="checkedB"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Airframe only"
                                                />
                                            </Form.Row>
                                            {!this.state.airFrameOnly &&
                                            <Form.Row>
                                                <Form.Group as={Col} md="4" xs="12">
                                                    <Form.Label>Engine Manufacturer</Form.Label>
                                                    <Select
                                                        value={selected_engine_manufacturer}
                                                        model="engine_manufacturer"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'engine_manufacturer')}
                                                        options={engine_manufacturer}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} md="4" xs="12">
                                                    <Form.Label>Engine Type</Form.Label>
                                                    <Select
                                                        value={selected_engine_type}
                                                        model="engine_type"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'engine_type')}
                                                        options={engine_type}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} md="4" xs="12">
                                                    <Form.Label>Engine Model</Form.Label>
                                                    <Select
                                                        value={selected_engine_model}
                                                        model="engine_model"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'engine_model')}
                                                        options={engine_model}
                                                    />
                                                </Form.Group>
                                            </Form.Row>
                                            }
                                            <Form.Row>
                                                <Form.Group as={Col} xs="12">
                                                    <Form.Label>Additional details</Form.Label>
                                                    <Form.Control as="textarea" rows="5"
                                                                  required
                                                                  type="text"
                                                                  placeholder=""
                                                                  model="aircraft"
                                                                  name="description"
                                                                  defaultValue={aircraft ? aircraft.description : ''}
                                                                  onBlur={e => this.handleChange(e)}
                                                    />
                                                </Form.Group>
                                            </Form.Row>
                                            <div>
                                                <Link href="#" onClick={(e) => this.handleModalShow(e, 'engine')}>
                                                    Didn't find your engines? Please click here to suggest.
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-wizard-v1__content" data-ktwizard-type="step-content">
                                    <div className="kt-heading kt-heading--md">Commercial Info</div>
                                    <div className="kt-form__section kt-form__section--first">
                                        <div className="kt-wizard-v1__form">

                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">
                                                    Offered For
                                                </Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Select
                                                        value={selected_offer_for}
                                                        model="aircraft"
                                                        name="offer_for"
                                                        onChange={e => this.selectChange(e, 'offer_for')}
                                                        options={AIRCRAFT_OFFER}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            {this.state.aircraft['offer_for'] === 'Sale' &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">Asking
                                                    Price</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        placeholder=""
                                                        model="aircraft"
                                                        name="price"
                                                        defaultValue={aircraft ? aircraft.price : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.aircraft['offer_for'] === 'ACMI' &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">MGH /
                                                    m</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder=""
                                                        model="aircraft"
                                                        name="mgh"
                                                        defaultValue={aircraft ? aircraft.mgh : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            }
                                            {(
                                                this.state.aircraft['offer_for'] === 'Dry Lease' ||
                                                this.state.aircraft['offer_for'] === 'Wet Lease' ||
                                                this.state.aircraft['offer_for'] === 'Lease Purchase' ||
                                                this.state.aircraft['offer_for'] === 'Exchange' ||
                                                this.state.aircraft['offer_for'] === 'Charter'
                                            )
                                            &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">{this.state.aircraft['offer_for']} terms</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Form.Control
                                                        as="textarea" rows="5"
                                                        model="aircraft"
                                                        name="terms"
                                                        defaultValue={aircraft ? aircraft.terms : ''}
                                                        onBlur={e => this.handleChange(e)}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            }
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">Availablity</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <ThemeProvider theme={defaultMaterialTheme}>
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <DatePicker
                                                                required
                                                                minDate={new Date('1990-01-01')}
                                                                value={availability}
                                                                format="dd/MM/yyyy"
                                                                onChange={e => this.handleChange(e, 'availability')}
                                                                animateYearScrolling
                                                            />
                                                        </MuiPickersUtilsProvider>
                                                    </ThemeProvider>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">Current
                                                    Location</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Select
                                                        value={selected_current_location}
                                                        model="current_location"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'current_location')}
                                                        options={countries}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">Primary
                                                    Contact</Form.Label>
                                                <Col sm="9" lg="6">
                                                    <Select
                                                        value={selected_primary_contact}
                                                        model="primary_contact"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'primary_contact')}
                                                        options={contacts}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            {this.state.selectedExtraFields.includes("owner") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">Owner</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Select
                                                        value={selected_owner}
                                                        model="owner"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'owner')}
                                                        options={companies}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraField(e, 'owner', 'Owner')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFields.includes("seller") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">Seller</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Select
                                                        value={selected_seller}
                                                        model="seller"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'seller')}
                                                        options={companies}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraField(e, 'seller', 'Seller')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFields.includes("manager") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"
                                                            className="text-sm-right text-left">Manager</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Select
                                                        value={selected_manager}
                                                        model="selected_manager"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'manager')}
                                                        options={companies}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraField(e, 'manager', 'Manager')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFields.includes("previous_operator") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">Previous
                                                    Operator</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Select
                                                        value={selected_previous_operator}
                                                        model="previous_operator"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'previous_operator', 'Previous Operator')}
                                                        options={companies}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraField(e, 'previous_operator')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            {this.state.selectedExtraFields.includes("current_operator") &&
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3" className="text-sm-right text-left">Current
                                                    Operator</Form.Label>
                                                <Col sm="6" lg="6">
                                                    <Select
                                                        value={selected_current_operator}
                                                        model="current_operator"
                                                        name="name"
                                                        onChange={e => this.selectChange(e, 'current_operator')}
                                                        options={companies}
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <IconButton aria-label="delete"
                                                                onClick={(e) => this.removeExtraField(e, 'current_operator', 'Current Operator')}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </Col>
                                            </Form.Group>
                                            }
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3"></Form.Label>
                                                <Col sm="9" lg="6">
                                                    <FormControl variant="outlined" fullWidth={true}>
                                                        <SelectCore
                                                            native
                                                            value=""
                                                            onChange={(e) => this.selectMoreFields(e, e.target.value)}
                                                        >
                                                            <option value="" disabled>Add more fields</option>
                                                            {this.state.commercialExtraFields.map(item => (
                                                                <option value={item.value}
                                                                        data-label={item.label}>{item.label}</option>
                                                            ))}
                                                        </SelectCore>
                                                    </FormControl>
                                                </Col>
                                            </Form.Group>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-wizard-v1__content" data-ktwizard-type="step-content">
                                    <div className="kt-heading kt-heading--md">Files &amp; Photos</div>
                                    <div className="kt-form__section kt-form__section--first">
                                        <div className="kt-wizard-v1__form">
                                            <Dropzone
                                                inputContent="Drop a PDF file here, or click to select a file to upload."
                                                accept=".pdf"
                                                styles={{dropzone: {height: 250}}}
                                                getUploadParams={(data) => this.getUploadParams(data)}
                                                onChangeStatus={(data, status) => this.onAttachmentUpload(data, status)}
                                                maxSizeBytes={(1024 * 1024 * 2)}
                                                initialFiles={initialFiles}
                                            />
                                            <hr/>
                                            <Button onClick={() => this.medialibraryAsset.current.galleryModalOpener()}
                                                    className="btn btn-primary">
                                                <i className="fa fa-upload"></i> Select or Upload Images
                                            </Button>
                                            <MediaLibrary modal={true} ref={this.medialibraryAsset}
                                                          user={selected_user.value}
                                                          showLibrary={selected_user.value === "" ? false : true}
                                                          selected_images={this.state.selected_images}
                                                          insertImages={(images) => this.setState({selected_images: images})}/>
                                            <Form.Row>
                                                <Form.Group as={Col} xs="12">
                                                    <Gallery enableLightbox={false} id="readonlygallery" rowHeight={150}
                                                             margin={5}
                                                             enableImageSelection={true}
                                                             onSelectImage={(e) => this.removeImage(e)}
                                                             images={this.state.selected_images}
                                                             onClickThumbnail={(e) => this.onClickThumbnail(e)}/>
                                                </Form.Group>
                                            </Form.Row>
                                        </div>
                                    </div>
                                </div>

                                <div className="kt-form__actions">
                                    <div
                                        className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u  mr-2">
                                        <Link to={"/" + USER_URL + "/aircraft/asset"}>
                                            <i className="la la-long-arrow-left"></i>
                                            Cancel
                                        </Link>
                                    </div>
                                    <div
                                        className="btn btn-secondary btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                        data-ktwizard-type="action-prev">
                                        Previous
                                    </div>
                                    <Button type="submit" onClick={(e) => this.setState({action: 'save'})}
                                            className="btn btn-success btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                            data-ktwizard-type="action-submit">
                                        Submit
                                    </Button>
                                    <div
                                        className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u"
                                        data-ktwizard-type="action-next">
                                        Next Step
                                    </div>
                                </div>

                            </Form>

                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

class EditPage extends React.Component {
    constructor(props) {
        super(props);
        let type = props.match.params.type;
        this.state = {errors: {}, showError: false};
        this.state.type = type;
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
                                const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                                return <li key={index + i}><span
                                    style={{'text-transform': 'capitalize'}}>{fieldName.replace(/_/g, " ")}</span> : {error}
                                </li>
                            });
                        })
                    }
                </Notice>
                <Edit data={this.props} sendError={this.sendError}/>
            </>
        );
    }
}

export default withRouter(EditPage);