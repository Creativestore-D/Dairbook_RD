import React from "react";
import axios from 'axios';
import { list } from "../../crud/api";
import Notice from "../../partials/content/Notice";
import Paper from '@material-ui/core/Paper';

export default class Permissiondenied extends React.Component {

 render() {

   return (
     <div>
      <Paper>
        <div>
          <div className="kt-portlet__body">
            <Notice icon="flaticon-warning kt-font-primary">
            Looks like that you don't have sufficient permission
            </Notice>
          </div>
        </div>
      </Paper>
    </div>
     )
 }
}