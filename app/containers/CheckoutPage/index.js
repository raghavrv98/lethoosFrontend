/**
 *
 * CheckoutPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectCheckoutPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header/Loadable'
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { errorHandler } from "../../utils/customUtils";

/* eslint-disable react/prefer-stateless-function */
export class CheckoutPage extends React.PureComponent {

  state = {
    payload: {
      alternateMobileNumber: "",
      name: "",
      address: "",
      orderHistory: {
        orderNumber: "",
        area: "other25",
        coupon: "",
        paymentMethod: "online",
        orderDate: "",
        orderAddress: "",
        orderAlternateMobileNumber: "",
        otherSpecifications: ""
      },
    },
    isCouponExist: false,
    confirmModal: false,
    codeCouponText: "",
    isLoader: false,
    copiedText: ""
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getShopDetails()
    }
    let payload = cloneDeep(this.state.payload)
    let orderHistory = sessionStorage.getItem("orderHistory") ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.payload.orderHistory);
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }

    payload.orderHistory = {
      shopName: orderHistory.name,
      shopAddress: orderHistory.address,
      shopMobileNumber: orderHistory.mobileNumber,
      shopImage: orderHistory.image,
      orders: orderHistory.orders,
      coupon: "",
      total: orderHistory.total,
      area: customerDetails.area ? customerDetails.area : payload.orderHistory.area,
      otherSpecifications: orderHistory.otherSpecifications
    }

    payload.name = customerDetails.name
    payload.mobileNumber = customerDetails.mobileNumber
    payload.alternateMobileNumber = customerDetails.alternateMobileNumber
    payload.address = customerDetails.address

    this.setState({
      customerDetails,
      payload
    })
  }

  inputChangeHandler = event => {
    let payload = cloneDeep(this.state.payload)

    if (event.target.id === "area" || event.target.id === "paymentMethod" || event.target.id === "otherSpecifications") {
      payload.orderHistory[event.target.id] = event.target.value
    }
    else {
      payload[event.target.id] = event.target.value
    }
    this.setState({
      payload,
      copiedText: ""
    })
  }

  couponInputChangeHandler = event => {
    let payload = cloneDeep(this.state.payload)

    payload.orderHistory[event.target.id] = (event.target.value).toUpperCase();

    this.setState({
      payload,
      codeCouponText: ""
    })
  }

  totalBillHandler = (delivery, bill) => {
    let totalBill = parseInt(bill) + parseInt(delivery)
    this.setState({
      totalBill
    })
    return totalBill
  }

  orderConfirmHandler = (event) => {
    event.preventDefault()
    let payload = cloneDeep(this.state.payload)

    payload.orderHistory.orderNumber = this.state.customerDetails.orderHistory.length + 1
    payload.orderHistory.totalDiscount = this.state.codeCouponText === "Code applied" ? this.state.customerDetails.coupon.find(val => val.name === this.state.payload.orderHistory.coupon).amount : 0
    payload.orderHistory.orderDate = new Date().getTime()
    payload.orderHistory.orderAddress = payload.address
    payload.orderHistory.orderAlternateMobileNumber = payload.alternateMobileNumber

    this.setState({
      confirmModal: true,
      payload
    })
  }

  modalCloseHandler = () => {
    this.setState({
      confirmModal: false
    })
  }

  checkCouponCode = () => {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    let coupon = this.state.payload.orderHistory.coupon
    let selectedCoupon = customerDetails.coupon.find(val => val.name === coupon)
    let isCouponExist = selectedCoupon && parseInt(selectedCoupon.redeemAttempt) > 0 && selectedCoupon.validity > new Date().getTime()

    let codeCouponText = isCouponExist ? "Code applied" : "Code does not exist"

    this.setState({
      codeCouponText
    })
  }

  grandTotalBill = (totalBill, amount) => {
    return totalBill - amount
  }

  orderPlacedHandler = () => {

    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    let payload = cloneDeep(this.state.payload)
    let orderHistoryCopy = payload.orderHistory

    let index = customerDetails.coupon.findIndex(val => val.name == orderHistoryCopy.coupon)

    if (index != -1) {
      customerDetails.coupon[index].redeemAttempt = (customerDetails.coupon[index].redeemAttempt).toString() == '0' ? 0 : parseInt(customerDetails.coupon[index].redeemAttempt) - 1
    }

    payload.name = customerDetails.name
    payload.mobileNumber = customerDetails.mobileNumber
    payload.alternateMobileNumber = customerDetails.alternateMobileNumber
    payload.address = customerDetails.address

    payload.orderHistory = customerDetails.orderHistory
    payload.coupon = customerDetails.coupon
    orderHistoryCopy.isOrderCancel = false
    payload.orderHistory.push(orderHistoryCopy)

    let orders = []
    orderHistoryCopy.orders.map(val => {
      let orderDetails = ` ${val.item} ${val.isHalfSelected ? "(Half)" : ""} X ${val.isHalfSelected ? val.halfQuantity : val.quantity} = ${val.price}`
      orders.push(orderDetails)
      return val
    })

    let mailDetails = {
      shopName: orderHistoryCopy.shopName,
      shopImage: orderHistoryCopy.shopImage,
      shopAddress: orderHistoryCopy.shopAddress,
      shopMobileNumber: orderHistoryCopy.shopMobileNumber,
      customerName: customerDetails.name,
      customerId: customerDetails._id,
      customerAddress: orderHistoryCopy.orderAddress,
      customerNumber: customerDetails.mobileNumber,
      customerCallingNumber: orderHistoryCopy.orderAlternateMobileNumber,
      customerCoupon: orderHistoryCopy.coupon,
      customerPaymentMethod: payload.paymentMethod,
      customerTotalDiscount: orderHistoryCopy.totalDiscount,
      customerTotalAmount: orderHistoryCopy.total,
      customerArea: orderHistoryCopy.area.slice(0, -2),
      customerOrderNumber: orderHistoryCopy.orderNumber,
      customerOrderDate: orderHistoryCopy.orderDate,
      orderSpecifications: orderHistoryCopy.otherSpecifications,
      customerOrders: orders,
      isOrderCancel: false,
      customerDeliveryCharges: orderHistoryCopy.area.slice(-2),
    }

    var url = window.API_URL + `/customerLogin/orderDetails/mail`;
    axios.post(url, mailDetails)
      .then((res) => {
        this.setState({
          confirmModal: false
        })
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });

    url = window.API_URL + `/customerLogin/orderDetails`;
    axios.post(url, mailDetails)
      .then((res) => {
        this.setState({
          confirmModal: false
        })
        sessionStorage.removeItem("orderHistory");
        this.props.history.push('/orderPlacedPage')
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });

    this.setState({
      isLoader: true,
      confirmModal: false
    },
      () => this.orderPlacedApiHandler(payload)
    )
  }

  orderPlacedApiHandler = (payload) => {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;

    let url = window.API_URL + `/customerLogin/${customerDetails._id}`;
    axios.patch(url, payload)
      .then((res) => {
        this.setState({
          confirmModal: false
        })
        sessionStorage.removeItem("orderHistory");
        this.props.history.push('/orderPlacedPage')
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });
  }

  copyPhoneNumber = (phoneNumber) => {
    let tempElement = document.createElement("textarea");
    tempElement.value = phoneNumber;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);

    this.setState({
      copiedText: "Phone Number Copied"
    })
  };

  copyNumberToCallingHandler = () => {
    let payload = cloneDeep(this.state.payload)

    payload.alternateMobileNumber = payload.mobileNumber

    this.setState({
      payload
    })

  }

  radioButtonChangeHandler = event => {
    let payload = cloneDeep(this.state.payload)

    payload[event.target.id] = event.target.value

    this.setState({
      payload,
      isOnlineMessageOpen: !(event.target.value === 'Cash On Delivery'),
      copiedText: ""
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>CheckoutPage</title>
          <meta name="description" content="Description of CheckoutPage" />
        </Helmet>

        <Header />

        <p className="offers-heading">Cart</p>
        {this.state.payload.orderHistory.orders && this.state.payload.orderHistory.orders.length > 0 ?
          <form onSubmit={this.orderConfirmHandler}>
            <div className="checkout-outer row">
              <div className="col-md-6 customer-info">
                {this.state.isLoader ?
                  <div className="lds-dual-ring"></div>
                  :
                  <React.Fragment>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Name</label>
                      <input value={this.state.payload.name} id="name" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                      <input value={JSON.parse(sessionStorage.getItem('customerDetails')).mobileNumber} pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required readOnly />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Mobile Number for Call</label>
                      <button className="same-as-above-btn" onClick={this.copyNumberToCallingHandler} type="button">Same as Above</button>
                      <input value={this.state.payload.alternateMobileNumber} pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" id="alternateMobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Address</label>
                      <textarea rows="3" cols="50" value={this.state.payload.address} id="address" pattern="^[A-Za-z_-][A-Za-z0-9_-]*$" title="Use only Numbers, Alphabets, spaces and ," onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Select Area</label>
                      <select className="area-box" onChange={this.inputChangeHandler} value={this.state.payload.orderHistory.area} id="area" required>
                        <option value="Other25">Other</option>
                        <option value="aryaNagar15">Arya Nagar</option>
                        <option value="ramNagar15">Ram Nagar</option>
                        <option value="punjabiColony15">Punjabi Colony</option>
                        <option value="gopalNagar15">Gopal Nagar</option>
                        <option value="baldevGanj15">Baldev Ganj</option>
                        <option value="baldevGanj15">Bus Stand</option>
                        <option value="shekhanMohalla15">Shekhan Mohalla</option>
                        <option value="khedaUpar15">Kheda Upar</option>
                        <option value="talabShahi15">Talab Shahi</option>
                        <option value="lalaRamMarg15">Lala Ram Marg</option>
                        <option value="kaliMandir15">Kali Mandir</option>
                        <option value="bhatuColony15">Bhatu Colony</option>
                        <option value="nandgaonRoad25">Nandgaon Road</option>
                        <option value="newAnajMandi25">New Anaj Mandi</option>
                        <option value="jindalGateNoOne25">Jindal Gate no. 1</option>
                        <option value="jindalGateNoTwo25">Jindal Gate no. 2</option>
                        <option value="krishnaColony25">Krishna Colony</option>
                        <option value="agrawalColony25">Agrawal Colony</option>
                        <option value="narsiVillage25">Narsi Village</option>
                        <option value="gopalBagh25">Gopal Bagh</option>
                        <option value="kamlaNagar25">Kamla Nagar</option>
                        <option value="bathenGate25">Bathen Gate</option>
                        <option value="keshavKunj30">Keshav Kunj</option>
                        <option value="keshavKunj30">Kullamal Petrol Pump</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Payment Method</label>
                      <div>
                        <label className="radio-inline"><input type="radio" onChange={this.radioButtonChangeHandler} className="radio-btn-size" id="paymentMethod" value="Cash On Delivery" name="radio" required /><span className="radio-text-size">Cash on Delivery</span></label>
                        <label className="radio-inline"><input type="radio" onChange={this.radioButtonChangeHandler} onClick={this.slideHandler} className="radio-btn-size" id="paymentMethod" value="Online" name="radio" required /><span className="radio-text-size">Online</span></label>
                      </div>
                    </div>
                    {this.state.isOnlineMessageOpen && <div onClick={() => this.copyPhoneNumber('8630422423')} className="online-payment-message">
                      <p>Please pay on this number <strong>8630422423</strong>. And have a screenshot ready with you at the time of delivery.</p>
                      {this.state.copiedText.length > 0 ? <p>({this.state.copiedText})</p> : <p>(Tap to Copy)</p>}
                    </div>}
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Other Specifications</label>
                      <textarea rows="3" cols="50" value={this.state.payload.otherSpecifications} placeholder="For Example : Without Onion or less Spicy" id="otherSpecifications" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" />
                    </div>
                  </React.Fragment>
                }
              </div>
              <div className="col-md-5 bill-info">

                {this.state.isLoader ?
                  <div className="lds-dual-ring"></div>
                  :
                  <React.Fragment>
                    <p className="bill-info-heading">{this.state.payload.orderHistory.shopName}</p>
                    <p className="bill-info-heading">{this.state.payload.orderHistory.shopAddress}</p>
                    <hr />

                    {this.state.payload.orderHistory.orders.map((val, index) => {
                      return <div key={index} className="bill-info-text">
                        {val.isHalfSelected ?
                          <React.Fragment><span>{val.item} X {val.halfQuantity}</span> <span className="float-right">{val.price * val.halfQuantity}</span><span>(Half)</span></React.Fragment>
                          :
                          <React.Fragment><span>{val.item} X {val.quantity}</span> <span className="float-right">{val.price * val.quantity}</span></React.Fragment>
                        }
                      </div>
                    })}


                    <div className="bill-info-delivery-text"> Delivery Charges  <span className="float-right">+ {this.state.payload.orderHistory.area.slice(-2)}</span></div>
                    <div className="mr-t-25"><input value={this.state.payload.orderHistory.coupon} placeholder="Enter Code" id="coupon" onChange={this.couponInputChangeHandler} className="form-control input-lg checkout-apply-text" type="text" /><span onClick={() => this.props.history.push('/offersPage')} className="offers-check-text" >Offers</span><button onClick={() => this.state.payload.orderHistory.coupon.length > 0 ? this.checkCouponCode() : ""} className={`checkout-apply-btn ${this.state.payload.orderHistory.coupon.length > 0 ? "" : "checkout-apply-btn-disabled"}`} type="button">Apply</button></div>
                    <p className={this.state.codeCouponText === "Code applied" ? "checkout-code-applied" : "checkout-code-not-applied"}>{this.state.codeCouponText.length > 0 && this.state.codeCouponText}</p>
                    <hr />
                    <p className={this.state.codeCouponText === "Code applied" ? "checkout-discount-text" : "checkout-total-text"}> Total <span className="float-right">{this.totalBillHandler(this.state.payload.orderHistory.area.slice(-2), this.state.payload.orderHistory.total)}</span></p>
                    {this.state.codeCouponText === "Code applied" && <div className="checkout-discount-text">Total Discount <span className="float-right">- {this.state.customerDetails.coupon.find(val => val.name === this.state.payload.orderHistory.coupon).amount}</span></div>}
                    {this.state.codeCouponText === "Code applied" && <div className="checkout-total-text">Grand Total <span className="float-right">{this.grandTotalBill(this.state.totalBill, this.state.customerDetails.coupon.find(val => val.name === this.state.payload.orderHistory.coupon).amount)}</span></div>}
                    <button type="submit" className="btn btn-warning login-button place-order-button">Place Order</button>
                  </React.Fragment>
                }
              </div>
            </div>
          </form>
          :
          <React.Fragment>
            <div className="offers-page-outer text-center">
              <img className="offers-not-found" src={require('../../assets/images/emptycart1.png')} />
            </div>
          </React.Fragment>
        }

        {
          this.state.confirmModal && <div className="modal display-block">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title confirm-modal-heading">Order Confirmation</h5>
                  <button type="button" className="close confirm-modal-close" onClick={this.modalCloseHandler}>
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                  </button>
                </div>
                <div className="modal-body confirm-modal-body">
                  Are You sure want to Place Order?
              </div>
                <div className="modal-body confirm-modal-body-2">
                  Once Placed, Order can not be Canceled.
              </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary confirm-modal-no" onClick={this.modalCloseHandler}>No</button>
                  <button type="button" className="btn btn-secondary confirm-modal-yes" onClick={this.orderPlacedHandler}>Yes</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div >
    );
  }
}

CheckoutPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  checkoutPage: makeSelectCheckoutPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'checkoutPage', reducer });
const withSaga = injectSaga({ key: 'checkoutPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CheckoutPage);
