import React from "react";

import Notice from "../../partials/content/Notice";
import {Button, Modal, Form} from "react-bootstrap";
import {
  Checkbox,
  FormControlLabel,FormGroup,
  FormControl, Button as ButtonCore,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import { list, post, USER_URL, MEDIA_URL, SUBSCRIPTION_DURATION } from "../../crud/api";
import Select from 'react-select';
import {CloudUpload as CloudUploadIcon} from "@material-ui/icons";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,DatePicker } from "@material-ui/pickers";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import moment from "moment";

class PromoteModes extends React.Component {
  static_labels = ['aircraft', 'engine', 'apu', 'wanted', 'parts']
  constructor(props) {
    super(props);

    this.state = {
        validated: false,
        plans:[],
        selected_plan1_dur:'monthly',
        selected_plan2_dur:'monthly',
        paytab_url:'',
        showPaymentModal:false,
        user:{},
        selected_dur:'',
        selected_plan:'',
        aircraft_qty:1,
        engine_qty:1,
        apu_qty:1,
    };

    this.getCurrentUser();

  }

  buyPlan(index) {
    if(index !== 0)
      this.makePayment(index);
  }

  makePayment(index) {
    let order_id = null;
    if(index === 1){
      if(this.state.selected_plan1_dur === 'monthly')
        order_id = '101';
      else if (this.state.selected_plan1_dur === 'yearly') 
        order_id = '102';
    }
    else if(index === 2) {
      if(this.state.selected_plan2_dur === 'monthly')
        order_id = '201';
      else if(this.state.selected_plan2_dur === 'yearly')
        order_id = '202';
    }
    let plan = this.state.plans[index];
    /**
    * Please refere to Paytabs Documentation to understand all variables and different payment methods https://dev.paytabs.com/docs/paypage.html
    You can get your email and secret key from paytabs merchant dashboard
    * https://www.paytabs.com/login/
    */
    post('paytab/createPage', {
      plan:plan.id, o_id:order_id,
      aircraft_qty:this.state.aircraft_qty,
      apu_qty:this.state.apu_qty,
      engine_qty:this.state.engine_qty
    }).then(
      (response) => {
      if(response.data.success){
          //Redirect your merchant to the payment link
          window.open(response.data.payment_url);

      } else {
          //Handle the error
          console.log(response.data);
      }
    }).catch(error => { 
    });
  }

  getCurrentUser(){
    list('users/me/').then(function (response) {
         if(response){
            let selected_dur = ''; let selected_plan = ''; 
            if (response.data.order_id === '101') {
              selected_dur = 'monthly';
              selected_plan = 1; //index
            }
            else if (response.data.order_id === '102'){
              selected_dur = 'yearly';
              selected_plan = 1; //index
              this.setState({selected_plan1_dur: selected_dur})
            }
            else if (response.data.order_id === '201') {
              selected_dur = 'monthly';
              selected_plan = 2; //index
            }
            else if (response.data.order_id === '202') {
              selected_dur = 'yearly';
              this.setState({selected_plan2_dur: selected_dur})
              selected_plan = 2; //index
            }

            this.setState({user:response.data, selected_plan:selected_plan, selected_dur:selected_dur});

         }

    this.getPlans();
    }.bind(this));
  }

  getPlans() {
     list('plans').then(function (response) {
         if(response){
             response.data.map((value, index) => {
              // for plan 2 do some calculations for quantity
              if(value.id === 2) {
                let calculated_amount = 0;
                // check if user already purchased that plan than set his selected quantities
                 let lbl_vals = [];
                if(value.credits !== null && value.credits.length) {
                  value.credits.map((val, i) => {
                    this.setState({[val.credits_type+'_qty']: val.value});
                    lbl_vals[val.credits_type+'_value'] = value[val.credits_type+'_value'] * val.value;
                  })
                } else // else simply add the values 
                  lbl_vals = value;
                response.data[index].price = this.calculatePrice(lbl_vals);
              }
              this.setState({plans:response.data});

             });
         }
    }.bind(this));
  }

  onQuantityChange(e, label, index) {
    if(e.target.value > 0) {
      this.setState({[label+'_qty'] : e.target.value});
      let lbl_vals = [];
      ['aircraft','engine','apu'].map((val, i) => {
        let curr_lbl_val = label === val ? e.target.value : this.state[val+'_qty'];
        lbl_vals[val+'_value'] = this.state.plans[index][val+'_value'] * curr_lbl_val
      })
      let price = this.calculatePrice(lbl_vals);
      let updatedPlans = this.state.plans.map((val, i) => {if(i===index) val.price = price; return val });
      this.setState({plans:updatedPlans})
    }

  }

  calculatePrice(value) {
    let ar_v = parseInt(value['aircraft_value']);
    let en_v = parseInt(value['engine_value']);
    let ap_v = parseInt(value['apu_value']);
    
    let price = (isNaN(ar_v) ? 0 : ar_v) + (isNaN(en_v) ? 0 : en_v) + (isNaN(ap_v) ? 0 : ap_v);
    if (this.state.selected_plan1_dur === 'yearly')
      price *= 12;
    return price; 
  }

  onChangeDur(e, index) {
      let plans = this.state.plans.map((val, i) => {
        if(i === index) {
          if(e.target.value === 'monthly')
            val.price /= 12
          else
            val.price *= 12
        }
        return val;
      })
    this.setState({['selected_plan'+index+'_dur']:e.target.value, plans:plans});
  }

  render() {
    const {plans, selected_dur, selected_plan, showPaymentModal, paytab_url, aircraft_qty, engine_qty, apu_qty} = this.state;
    // const { Formik } = formik;
    const buttons = <Link to={"/"+USER_URL+"/contacts"} className="btn btn-clean btn-icon-sm">
                      <i className="la la-long-arrow-left"></i>
                      Back
                    </Link>
    return (
      <>
        <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

              <div className="kt-portlet">
                <div className="kt-portlet__body kt-portlet__body--fit">

                  <div className="kt-pricing-4">
                    <div className="kt-pricing-4__top">
                      <div className="kt-pricing-4__top-container kt-pricing-4__top-container--fixed">
                        <div className="kt-pricing-4__top-header">
                          <div className="kt-pricing-4__top-title kt-font-light">
                           <h1>Airbook Plans</h1>
                            <h3>The most cost-effective & advanced aviation remarketing
platform for you.</h3>
                          </div>
                        </div>
                        <div className="kt-pricing-4__top-body">

                          <div className="kt-pricing-4__top-items">
                          { plans.map((plan, index) => {
                            return <div key={index} className="kt-pricing-4__top-item">
                              <span className="kt-pricing-4__icon kt-font-info">
                                  {plan.media && plan.media.original_file_name &&
                                    <img width="300px" src={MEDIA_URL + plan.media.original_file_name}/>
                                  }
                              </span>
                              <h2 className="kt-pricing-4__subtitle">{plan.title}</h2>
                              <div className="kt-pricing-4__features">
                                <span>{plan.sub_title}</span>
                              </div>
                              {plan.price_label && plan.id !== 2 ?
                                <span className="kt-pricing-4__price">{plan.price_label}</span>
                                :
                                <>
                                <span className="kt-pricing-4__price">{parseInt(plan.price)}</span>
                                <span className="kt-pricing-4__label">$</span>
                                </>
                              }
                              
                              <br/>
                              {index !== 0 ?
                              <Form style={{width: '120px', margin: '0px auto'}} className="form-control" as="select" onChange={(e)=>this.onChangeDur(e, index)}>
                                {
                                  SUBSCRIPTION_DURATION.map((val, i) => {
                                    return <option key={i} selected={index === selected_plan && val.value === selected_dur ? 'selected':''}  value={val.value}>{val.label}</option>
                                  })
                                }
                              </Form>
                              :<br/>}
                              <div className="kt-pricing-4__btn">
                                <button onClick={(e) => this.buyPlan(index)} disabled={index === selected_plan && this.state['selected_plan'+index+'_dur'] === selected_dur ? 'disabled':''} type="button" className="btn btn-brand btn-upper btn-bold">{plan.button_label}</button>
                              </div>

                              <div className="kt-pricing-4__top-items-mobile">
                                <div className="kt-pricing-4__top-item-mobile">
                                  <span>Number Of Users</span>
                                  <span>Up to 10k</span>
                                </div>
                                <div className="kt-pricing-4__top-item-mobile">
                                  <span>Domains</span>
                                  <span>1</span>
                                </div>
                                <div className="kt-pricing-4__top-item-mobile">
                                  <span>Projects</span>
                                  <span>5</span>
                                </div>
                                <div className="kt-pricing-4__top-item-mobile">
                                  <span>Storage</span>
                                  <span>5GB</span>
                                </div>
                                <div className="kt-pricing-4__top-item-mobile">
                                  <span>Supporet</span>
                                  <span>No</span>
                                </div>
                                <div className="kt-pricing-4__top-item-mobile">
                                  <span>Tutorials</span>
                                  <span>No</span>
                                </div>
                                <div className="kt-pricing-4__top-item-mobile">
                                  <span>Cancelation</span>
                                  <span>Yes</span>
                                </div>
                                <div className="kt-pricing-4__top-btn">
                                  <button type="button" className="btn btn-brand btn-upper btn-bold">Purchase</button>
                                </div>
                              </div>
                            </div>
                            })
                          }
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="kt-pricing-4__bottom">
                      <div className="kt-pricing-4__bottok-container kt-pricing-4__bottok-container--fixed">
                        
                      {this.static_labels.map((label, i)=> { 
                        return <div key={i} className="kt-pricing-4__bottom-items">
                          <div className="kt-pricing-4__bottom-item">
                            {label.charAt(0).toUpperCase() + label.slice(1)}
                          </div>
                          {plans.map((plan, index) => {
                            return <div key={index} className="kt-pricing-4__bottom-item">
                            {index === 1 && ['aircraft', 'engine', 'apu'].indexOf(label) > -1 ? 
                              <Form.Group style={{width: '100px', margin: '0 auto'}}>
                                  <Form.Control onChange={(e) => this.onQuantityChange(e, label, index)} value={this.state[label+'_qty']} type="number" min="1" />
                              </Form.Group>
                              :
                              <>
                              {plan[label+'_label'] ? plan[label+'_label'] : ''}
                              {plan[label+'_label'] &&  plan[label+'_value'] ? <br/> : ''}
                              {plan[label+'_value'] ? plan[label+'_value'] : ''}
                              </>
                          }
                            </div> 
                          })}
                        </div>
                      })}

                      {plans.length ?
                        plans[0].custom.map((custom, index)=> {
                          return <div key={index} className="kt-pricing-4__bottom-items">
                            <div className="kt-pricing-4__bottom-item">
                              {custom.main_heading}
                            </div>
                           {plans.map((plan, i) => {
                            return <div key={i} className="kt-pricing-4__bottom-item">
                              {plan.custom[index].label ? plan.custom[index].label : ''}
                              {plan.custom[index].value &&  plan.custom[index].label ? <br/> : ''}
                              {plan.custom[index].value ? plan.custom[index].value : ''}
                            </div>
                          })}
                          </div>
                        })
                      :'' }
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
      </>
    );
  }
}

export default withRouter(PromoteModes);