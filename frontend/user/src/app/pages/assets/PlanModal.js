import React from 'react';
import {Button, Dropdown, Modal, Form} from "react-bootstrap";
import { list, USER_URL } from "../../crud/api";

export default class PlanModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plan:null,
      countData:0
    }

    this.getPlanDetails();
  }

  getPlanDetails() {
    list('users/plan', {type:'Ab'+this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)+'s'}).then(function (response) {
      this.setState({plan:response.data.plan, countData:response.data.countData});
    }.bind(this));
  }

  handleSelectPlan(event, featured) {
    if(!this.state.plan && featured !== 0)
      this.props.data.history.push('/'+USER_URL+'/promote');
    else {
      let extra_data = this.props.data.extra_data;
      extra_data['is_featured_'+this.props.type] = featured;
      this.props.data.setExtraData(extra_data);
      this.props.data.history.push('/'+USER_URL+'/aircraft/asset/create');
    }
  }

  render() {
    const {countData, plan} = this.state;
    return (
      <Modal
          size="lg"
          show={this.props.modal_display}
          onHide={(e) => this.props.setPlanModalDisplay(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center" id="example-modal-sizes-title-lg" style={{width:'100%'}}>
              Select {this.props.type} promote mode
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="kt-pricing-3" style={{padding:0}}>
              <div className="kt-pricing-3__items">
                <div className="row row-no-padding">
                  <div className="kt-pricing-3__item col-lg-6" style={{boxShadow:'0px 0px 1px 1px #ececec'}}>
                    <div className="kt-pricing-3__wrapper" style={{padding:'25px 10px'}}>
                      <h3 className="kt-pricing-3__title">Basic</h3>
                      <span className="kt-pricing-3__price kt-pricing-3__price--padding" style={{marginTop:'20px'}}>Free</span><br/>
                      <span className="kt-pricing-3__description">
                        <span></span>
                      </span>
                      <div className="kt-pricing-3__btn">
                        <button onClick={(e) => this.handleSelectPlan(e, 0)} type="button" className="btn  btn-brand btn-wide btn-upper btn-bold">Select</button>
                      </div>
                    </div>
                  </div>
                  <div className="kt-pricing-3__item col-lg-6" style={{boxShadow:'0px 0px 1px 1px #ececec'}}>
                    <div className="kt-pricing-3__wrapper" style={{padding:'25px 10px'}}>
                      <h3 className="kt-pricing-3__title">Premium</h3>
                      <span className="kt-pricing-3__price" style={{marginTop:'20px'}}>
                        <span className="kt-pricing-3__price--padding">Paid</span><br/>
                        <span className="kt-pricing-3__text">{plan ? plan[this.props.type+'_value'] - countData:0} of {plan ? plan[this.props.type+'_value']:0} credit available</span><br/>
                        <span className="kt-pricing-3__text">$ Maximize Leads</span><br/>
                        <span className="kt-pricing-3__text">Reach more people</span><br/>
                        <span className="kt-pricing-3__text">Premium Position on all pages</span><br/>
                        <span className="kt-pricing-3__text">Included in Global Newsletter</span><br/>
                      </span>
                      <div className="kt-pricing-3__btn">
                        <button onClick={(e) => this.handleSelectPlan(e, 1)} type="button" className="btn btn-brand btn-wide btn-upper btn-bold">{plan ? 'Select':'Go Plan'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    );
  }
}
