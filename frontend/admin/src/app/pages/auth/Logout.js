import React, { Component } from "react";
import * as auth from "../../store/ducks/auth.duck";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
    localStorage.removeItem('persist:demo1-auth');
  }

  render() {
    const { hasAuthToken } = this.props;

    return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to="/admin/auth" />;
  }
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
