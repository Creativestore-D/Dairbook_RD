import React, {useState} from "react";
import {Formik} from "formik";
import {Portlet, PortletBody, PortletFooter, PortletHeader, PortletHeaderToolbar} from "../../partials/content/Portlet";
import {FormHelperText, Switch, Tab, Tabs, TextField} from "@material-ui/core";
import {get} from "lodash";
import clsx from "clsx";

const localStorageActiveTabKey = "settingsActiveTab";

export default function Settings() {
    const activeTab = localStorage.getItem(localStorageActiveTabKey);
    const [tab, setTab] = useState(activeTab ? +activeTab : 0);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [loadingButtonPreviewStyle, setLoadingButtonPreviewStyle] = useState({
        paddingRight: "2.5rem"
    });
    const [loadingReset, setLoadingReset] = useState(false);
    const [loadingButtonResetStyle, setLoadingButtonResetStyle] = useState({
        paddingRight: "2.5rem"
    });

    const initialValues = {
        settings: localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : {
            api: {
                enable: false,
                access_key_id: "",
                secret_key_id: ""
            },
            site: {
                title: "",
                deactivate_days: "90"
            },
            payments: {
                enable: false
            }
        }

    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={values => {
                    console.log(values)
                }}
                onReset={() => {
                }}
            >
                {({values, handleReset, handleSubmit, handleChange, handleBlur}) => (
                    <div className="kt-form kt-form--label-right">
                        <Portlet>
                            <PortletHeader
                                toolbar={
                                    <PortletHeaderToolbar>
                                        <Tabs
                                            component="div"
                                            className="settings-tabs"
                                            value={tab}
                                            onChange={(_, nextTab) => {
                                                setTab(nextTab);
                                                localStorage.setItem(localStorageActiveTabKey, nextTab);
                                            }}
                                        >
                                            <Tab label="General Settings"/>
                                            <Tab label="API Settings"/>
                                            <Tab label="Payment Settings"/>
                                        </Tabs>
                                    </PortletHeaderToolbar>
                                }
                            />
                            {tab === 0 && (
                                <PortletBody>
                                    <div className="kt-section kt-margin-t-30">
                                        <div className="kt-section__body">
                                            {/*Site Title*/}
                                            <div className="form-group row">
                                                <div className="col-lg-9 col-xl-4">
                                                        <TextField
                                                            label="Site Title"
                                                            margin="normal"
                                                            onChange={handleChange}
                                                            name="settings.site.title"
                                                            variant="outlined"
                                                            value={get(values, "settings.site.title")}
                                                        />
                                                        <FormHelperText>Set site title</FormHelperText>
                                                </div>
                                            </div>
                                            {/**/}
                                            <div className="form-group row">
                                                <div className="col-lg-9 col-xl-4">
                                                        <TextField
                                                            label="Auto deactivate listings (days)"
                                                            margin="normal"
                                                            onChange={handleChange}
                                                            name="settings.site.deactivate_days"
                                                            variant="outlined"
                                                            value={get(values, "settings.site.deactivate_days")}
                                                        />
                                                        <FormHelperText>Set number of days to auto deactivate listings.</FormHelperText>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </PortletBody>
                                )}

                                {tab === 1 && (
                                    <PortletBody>
                                        <div className="kt-section kt-margin-t-30">
                                            <div className="kt-section__body">
                                                {/*Enable API row*/}
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label">
                                                        Enable API:
                                                    </label>
                                                    <div className="col-lg-9 col-xl-4">
                                                        <Switch
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            name="settings.api.enable"
                                                            checked={get(values, "settings.api.enable")}
                                                        />
                                                        <FormHelperText>
                                                            Enable/Disable Api
                                                        </FormHelperText>
                                                    </div>
                                                </div>
                                                {/*API Keys*/}
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label">
                                                    </label>
                                                    <div className="col-lg-9 col-xl-4">
                                                        <TextField
                                                            label="Access Key ID"
                                                            margin="normal"
                                                            onChange={handleChange}
                                                            name="settings.api.access_key_id"
                                                            variant="outlined"
                                                            value={get(values, "settings.api.access_key_id")}
                                                        />
                                                        <FormHelperText>Set Access Key ID</FormHelperText>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label">
                                                    </label>
                                                    <div className="col-lg-9 col-xl-4">
                                                        <TextField
                                                            label="Secret Access Key ID"
                                                            margin="normal"
                                                            onChange={handleChange}
                                                            name="settings.api.secret_key_id"
                                                            variant="outlined"
                                                            value={get(values, "settings.api.secret_key_id")}
                                                        />
                                                        <FormHelperText>Set Secret Access Key ID</FormHelperText>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PortletBody>
                                )}

                                {tab === 2 && (
                                    <PortletBody>
                                        <div className="kt-section kt-margin-t-30">
                                            <div className="kt-section__body">
                                                <div className="form-group row">
                                                    <label className="col-lg-3 col-form-label">
                                                        Enable Payment Settings:
                                                    </label>
                                                    <div className="col-lg-9 col-xl-4">
                                                        <Switch
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            name="settings.payments.enable"
                                                            checked={get(values, "settings.payments.enable")}
                                                        />
                                                        <FormHelperText>
                                                            Enable/Disable Payment
                                                        </FormHelperText>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PortletBody>
                                )}
                                <PortletFooter>
                                <div className="kt-padding-30 text-center">
                                    <button
                                        type="button"
                                        onClick={()=>{localStorage.setItem('settings',JSON.stringify(get(values, "settings")))}}
                                        style={loadingButtonPreviewStyle}
                                        className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                                            {
                                                "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loadingPreview
                                            }
                                        )}`}
                                    >
                                    <i className="la la-send"/> Submit
                                    </button>
                                </div>
                                </PortletFooter>
                        </Portlet>
                    </div>
                )}
            </Formik>
        </>
    );
}