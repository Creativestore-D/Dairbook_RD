import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Form, Col} from "react-bootstrap";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
} from "@material-ui/core";
import {Link, withRouter} from 'react-router-dom'
import {list, patch, PERMISSIONS} from "../../../crud/api";
import Select from 'react-select';


class Edit extends React.Component {

    constructor(props) {
        super(props);

        const {user_id} = this.props.data.match.params
        this.state = {
            validated: false,
            user: {},
            groups: [],
            companies: [],
            user_permissions: [],
            company: {label: 'Select Company', value: 0},
            group: {label: 'Select Group', value: 0},
        };

        this.getUser(user_id);
    }

    getCompanies() {
        let filter = {
            'is_active': 1,
            available: true,
            contact_id: this.state.user.contact ? this.state.user.contact.id : 0,
            records: 'all'
        };
        list('companies', filter).then(function (response) {
            let data = response.data;
            let selected_company = {};
            for (let opt in data) {
                data[opt].label = data[opt].name;
                data[opt].value = data[opt].id;
                try {
                    if (data[opt].id === this.state.user.contact.company.id)
                        selected_company = {'label': data[opt].name, 'value': data[opt].id}
                } catch (e) {
                }
            }
            this.setState({companies: data, company: selected_company});

        }.bind(this));
    }

    getGroups() {
        let filter = {records: 'all'};
        list('groups', filter).then(function (response) {
            let data = response.data;
            let selected_group = {};
            for (let opt in data) {
                if (data[opt].name !== 'user') {
                    data[opt].label = data[opt].name;
                    data[opt].value = data[opt].id;
                } else {
                    delete response.data[opt];
                    delete data[opt];
                }
                try {
                    if (data[opt].id === this.state.user.groups[0])
                        selected_group = {'label': data[opt].label, 'value': data[opt].id}
                } catch (e) {
                }
            }
            this.setState({groups: data, group: selected_group});
        }.bind(this));
    }

    getUser(user_id) {
        list('users/' + user_id + '/').then(
            (response) => {
                this.setState({user: response.data,})
                this.getCompanies();
                this.getGroups();
            });
    }

    selectChanged(value, key) {
        let user = this.state.user;
        if (key == 'company')
            user.contact[key] = value && value.id ? value.id : '';
        else if (key == 'group')
            user.groups = [value && value.id ? value.id : ''];

        this.setState({[key]: value ? value : '', user: user});
    };

    handleChange(event) {
        var user = this.state.user;
        var attr = event.target.name;
        var val = event.target.value;
        if (attr === 'is_active')
            val = parseInt(val);

        if (attr == 'password') {
            if (val != '')
                user.new_password = 1;
            else
                user.new_password = 0;
        }

        user[attr] = val;
        if (event.target.getAttribute('model') === 'contact') {
            if ('contact' in user)
                user['contact'][attr] = val;
            else
                user['contact'] = {[attr]: val};
        }
        this.setState({user: user})
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated: true});
        let user = this.state.user;
        if (user.contact.company !== undefined)
            user.contact.company = this.state.company.value;
        // we need contact as list - little late
        user.contact = user.contact ? [user.contact] : user.contact;
        patch('users/' + this.state.user.id + '/', user).then(
            (response) => {
                this.setState({user: response.data});
                this.props.data.history.push("/admin/admin-user");
            }).catch(error => {
            // this.props.sendError(error.response.data);
        });
    }

    render() {
        const {validated, user, companies, company, group, groups} = this.state;
        return (
            <Form
                noValidate
                onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>First name *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            model="contact"
                            name="first_name"
                            defaultValue={user.contact ? user.contact.first_name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Last name *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            model="contact"
                            name="last_name"
                            defaultValue={user.contact ? user.contact.last_name : ''}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            model="user"
                            name="email"
                            defaultValue={user.email}
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Role</Form.Label>
                        <Select
                            value={group}
                            model="groups"
                            name="group"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectChanged(e, 'group')}
                            options={groups}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Company</Form.Label>
                        <Select
                            value={company}
                            model="contact"
                            name="company"
                            isClearable={true}
                            escapeClearsValue={true}
                            onChange={e => this.selectChanged(e, 'company')}
                            options={companies}
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            placeholder="*******"
                            type="password"
                            model="user"
                            name="password"
                            onChange={e => this.handleChange(e)}
                        />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} md="12">
                        <FormControl component="fieldset" className="col-md-12">
                            <RadioGroup
                                aria-label="status"
                                name="is_active"
                                className="col-md-12"
                                value={user.is_active === 1 ? '1' : '0'}
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
                    Update & Close
                </Button>
                &nbsp;&nbsp;

                <Link to="/admin/admin-user" className="btn btn-danger">
                    <i className="la la-remove"/>
                    Cancel
                </Link>
            </Form>
        );
    }
}

// const { Formik } = formik;
const buttons = <Link to="/admin/admin-user" className="btn btn-clean btn-icon-sm">
    <i className="la la-long-arrow-left"></i>
    Back
</Link>

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
                            beforeCodeTitle="Admin User"
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