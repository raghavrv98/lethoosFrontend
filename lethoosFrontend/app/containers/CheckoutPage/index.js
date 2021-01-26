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
import { capitalizeFirstLetter } from '../../utils/customUtils'
import axios from 'axios';
import { cloneDeep } from 'lodash';

/* eslint-disable react/prefer-stateless-function */
export class CheckoutPage extends React.PureComponent {

  state = {
    payload: {
      alternateMobileNumber: "",
      address: "",
      paymentMethod: "",
      area: ""
    },
    orderHistory: [],
    confirmModal: true
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getShopDetails()
    }
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }
    this.setState({
      customerDetails,
      orderHistory
    })
  }

  inputChangeHandler = event => {
    let payload = cloneDeep(this.state.payload)
    payload[event.target.id] = event.target.value
    this.setState({
      payload
    })
  }

  totalBill = (bill, delivery) => {
    return parseInt(bill) + parseInt(delivery)
  }

  orderConfirmHandler = (event) => {
    event.preventDefault()
    this.setState({
      confirmModal: true
    })
  }

  modalCloseHandler = () => {
    this.setState({
      confirmModal: false
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>CheckoutPage</title>
          <meta name="description" content="Description of CheckoutPage" />
        </Helmet>
        <div className="header sticky-top">
          <img className="logo" src={require('../../assets/images/logo.png')} />
          <p className="logo-text">Le Thoos</p>
          <span className="nav-items">
            <span className="nav-mr"><i className="fa fa-tags" aria-hidden="true"></i> Offers</span>
            <span className="nav-mr"><i className="fa fa-history" aria-hidden="true"></i> Order History</span>
            <span className="nav-mr"><i className="fa fa-user" aria-hidden="true"></i> {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</span>
            <span className="nav-mr" onClick={() => { sessionStorage.clear(); this.props.history.push('/login') }}><i className="fa fa-power-off" aria-hidden="true"></i> Logout</span>
          </span>
        </div>
        <form onSubmit={this.orderConfirmHandler}>
          <div className="checkout-outer row">
            <div className="col-md-7 customer-info">
              <div className="form-group">
                <label className="box-label" htmlFor="inputlg">Name</label>
                <input value={capitalizeFirstLetter(JSON.parse(sessionStorage.getItem('customerDetails')).name)} id="name" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required readOnly />
              </div>
              <div className="form-group">
                <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                <input value={JSON.parse(sessionStorage.getItem('customerDetails')).mobileNumber} id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required readOnly />
              </div>
              <div className="form-group">
                <label className="box-label" htmlFor="inputlg">Alternate Mobile Number</label>
                <input value={this.state.payload.mobileNumber} id="alternateMobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
              </div>
              <div className="form-group">
                <label className="box-label" htmlFor="inputlg">Address</label>
                <textarea rows="3" cols="50" value={this.state.payload.address} id="address" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
              </div>
              <div className="form-group">
                <label className="box-label" htmlFor="inputlg">Select Area</label>
                <select className="area-box" onChange={this.inputChangeHandler} value={this.state.payload.area} id="area" required>
                  <option value="">Select</option>
                  <option value="kosi10">kosi</option>
                  <option value="jindal20">Jindal</option>
                  <option value="narsiVillage20">Narsi Village</option>
                  <option value="gopalBagh20">Gopal Bagh</option>
                  <option value="kamlaNagar20">Kamla Nagar</option>
                  <option value="bathenGate20">Bathen Gate</option>
                  <option value="Other20">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="box-label" htmlFor="inputlg">Payment Method</label>
                <div>
                  <label className="radio-inline"><input type="radio" onChange={this.inputChangeHandler} className="radio-btn-size" id="paymentMethod" value="Cash On Delivery" name="radio" required /><span className="radio-text-size">Cash on Delivery</span></label>
                  <label className="radio-inline"><input type="radio" onChange={this.inputChangeHandler} className="radio-btn-size" id="paymentMethod" value="Online" name="radio" required /><span className="radio-text-size">Online</span></label>
                </div>
              </div>
            </div>
            <div className="col-md-4 bill-info">
              <p className="bill-info-heading">{this.state.orderHistory.vendorName}</p>
              <p className="bill-info-heading">{this.state.orderHistory.address}</p>
              <hr />
              {this.state.orderHistory.orders.map((val, index) => {
                return <div key={index} className="bill-info-text">
                  {val.item} X {val.quantity} = {val.price * val.quantity}
                </div>
              })}
              <p className="bill-info-text"> Delivery Charges = {this.state.payload.area.length > 0 ? this.state.payload.area.slice(-2) : 'NA'}</p>
              <hr />
              <p className="bill-info-text"> Total : {this.state.payload.area.length > 0 ? this.totalBill(this.state.payload.area.slice(-2), this.state.orderHistory.total) : this.state.orderHistory.total}</p>
              <button type="submit" className="btn btn-warning login-button place-order-button">Place Order</button>
            </div>
          </div>
        </form>

        {this.state.confirmModal && <div className="modal display-block">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title confirm-modal-heading" id="exampleModalLabel">Order Confirmation</h5>
                <button type="button" className="close confirm-modal-close" onClick={this.modalCloseHandler}>
                  <i className="fa fa-times-circle" aria-hidden="true"></i>
                </button>
              </div>
              <div className="modal-body confirm-modal-body">
                Are You sure want to Place Order?
              </div>
              <div className="modal-body confirm-modal-body-2">
                Once Placed, Order can't be Canceled.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary confirm-modal-no" onClick={this.modalCloseHandler}>No</button>
                <button type="button" className="btn btn-primary confirm-modal-yes" onClick={() => this.props.history.push('/orderPlacedPage')}>Yes</button>
              </div>
            </div>
          </div>
        </div>}
      </div>
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
