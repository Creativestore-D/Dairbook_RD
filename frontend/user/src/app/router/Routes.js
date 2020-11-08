/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { useLastLocation } from "react-router-last-location";
import HomePage from "../pages/home/HomePage";
import ErrorsPage from "../pages/errors/ErrorsPage";
import LogoutPage from "../pages/auth/Logout";
import { LayoutContextProvider } from "../../_metronic";
import Layout from "../../_metronic/layout/Layout";
import * as routerHelpers from "../router/RouterHelpers";
import AuthPage from "../pages/auth/AuthPage";
import {USER_URL} from "../crud/api";

export const Routes = withRouter(({ history }) => {
    const lastLocation = useLastLocation();
    routerHelpers.saveLastLocation(lastLocation);
    const { isAuthorized, menuConfig, userLastLocation, user } = useSelector(
        ({ auth, urls, builder: { menuConfig } }) => ({
            menuConfig,
            isAuthorized: auth.user != null,
            user: auth.user,
            userLastLocation: routerHelpers.getLastLocation()
        }),
        shallowEqual
    );

  const [extra_data, setExtraData] = React.useState(extra_data ? extra_data:{});
    return (
        /* Create `LayoutContext` from current `history` and `menuConfig`. */
        <LayoutContextProvider history={history} menuConfig={menuConfig}>
            <Switch>
                {!isAuthorized ? (
                    /* Render auth page when user at `/auth` and not authorized. */
                    <AuthPage />
                ) : (
                    /* Otherwise redirect to root page (`/`) */
                    <Redirect from="/auth" to={userLastLocation} />
                )}

                <Route path="/error" component={ErrorsPage} />
                <Route path={"/"+USER_URL+"/logout"} component={LogoutPage} />

                {!isAuthorized ? (
                    /* Redirect to `/auth` when user is not authorized */
                    <Redirect to="/auth/login" />
                ) : (
                    <Layout>
                        <HomePage extra_data={extra_data} setExtraData={setExtraData} user={user} userLastLocation={userLastLocation} />
                    </Layout>
                )}
            </Switch>
        </LayoutContextProvider>
    );
});
