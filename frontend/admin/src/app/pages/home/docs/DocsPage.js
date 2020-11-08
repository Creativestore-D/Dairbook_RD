import React from "react";
import { Route, Switch } from "react-router-dom";
import QuickStartDocs from "./QuickStartDocs";
import DeploymentDocs from "./DeploymentDocs";
import OverviewDocs from "./OverviewDocs";
import I18nDocs from "./I18nDocs";
import MockBackendDocs from "./MockBackendDocs";
import CreateAPageDocs from "./CreateAPageDocs";
import UseADemo from "./UseADemo";

export default function DocsPage() {
  return (
    <Switch>
      <Route path="/admin/docs/quick-start" component={QuickStartDocs} />
      <Route path="/admin/docs/overview" component={OverviewDocs} />
      <Route path="/admin/docs/deployment" component={DeploymentDocs} />
      <Route path="/admin/docs/i18n" component={I18nDocs} />
      <Route path="/admin/docs/mock-backend" component={MockBackendDocs} />
      <Route path="/admin/docs/create-a-page" component={CreateAPageDocs} />
      <Route path="/admin/docs/use-a-demo" component={UseADemo} />
    </Switch>
  );
}
