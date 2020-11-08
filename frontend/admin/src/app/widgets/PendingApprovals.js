import React, { useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";

export default function PendingApprovals ({rowData, type}) {
  let history = useHistory();
  return (
      <div className="kt-widget5">
          {rowData &&
              rowData.map( (item, idx) => (
                  <div className="kt-widget5__item">
                      <div className="kt-widget5__content">
                          <div className="kt-widget5__section">
                              {item.title}
                              <div className="kt-widget5__info">
                                  <span>Author:</span>
                                  <span className="kt-font-info"> {item.user.contact ? item.user.contact.first_name +' '+ item.user.contact.last_names : ' -- '}</span>
                                  <span>Created:</span>
                                  <span className="kt-font-info"> {moment(item.created_at).format("DD-MM-YYYY")}</span>
                              </div>
                          </div>

                      </div>
                      <div className="kt-widget5__content">
                          <div className="kt-widget5__stats">
                              <a onClick={() => history.push("/admin/"+type+"/asset/"+item.id) } className="btn btn-sm btn-label-brand btn-bold">View Detail</a>
                          </div>
                      </div>
                  </div>
              ))
          }
      </div>
  );
}
