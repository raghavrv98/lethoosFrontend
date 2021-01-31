/**
 *
 * OrderHistoryPage
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
import makeSelectOrderHistoryPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { capitalizeFirstLetter } from '../../utils/customUtils'
import axios from 'axios';
import messages from './messages';
import moment from 'moment';

var itemTotal = 0
/* eslint-disable react/prefer-stateless-function */
export class OrderHistoryPage extends React.PureComponent {

  state = {
    customerDetails: {},
    couponIdCopy: "",
    detailsModal: false,
  }

  componentWillMount() {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }
    this.setState({
      customerDetails
    }, () => this.customerDetailsHandler())
  }

  detailsModalHandler = (val) => {
    itemTotal = 0
    this.setState({
      detailsModal: true,
      modalDetailObject: val
    })
  }

  modalCloseHandler = () => {
    this.setState({
      detailsModal: false
    })
  }

  grandTotalBill = (totalBill, delivery, discount) => {
    return (parseInt(totalBill) + parseInt(delivery)) - parseInt(discount)
  }

  itemTotalHandler = (price, quantity) => {
    let singleItemTotal = parseInt(price) * parseInt(quantity)
    itemTotal = itemTotal + parseInt(price) * parseInt(quantity)
    return singleItemTotal
  }

  customerDetailsHandler = () => {
    let url = window.API_URL + `/customerLogin/${this.state.customerDetails._id}`;
    axios.get(url)
      .then((res) => {
        const customerDetails = res.data;
        sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails))
        this.setState({
          customerDetails
        })
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>OrderHistoryPage</title>
          <meta name="description" content="Description of OrderHistoryPage" />
        </Helmet>

        <div className="header sticky-top">
          <img className="logo" src={require('../../assets/images/logo.png')} />
          <p className="logo-text">Le Thoos</p>
          <span className="nav-items">
            <span className="nav-mr" onClick={() => this.props.history.push('/landingPage')}><i className="fa fa-home" aria-hidden="true"></i> Shops</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/offersPage')}><i className="fa fa-tags" aria-hidden="true"></i> Offers</span>
            {/* <span className="nav-mr"><i className="fa fa-history" aria-hidden="true"></i> Order History</span> */}
            <span className="nav-mr" onClick={() => this.props.history.push('/profilePage')}><i className="fa fa-user" aria-hidden="true"></i> {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/checkoutPage')}><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart</span>
            <span className="nav-mr" onClick={() => { sessionStorage.clear(); this.props.history.push('/login') }}><i className="fa fa-power-off" aria-hidden="true"></i> Logout</span>
          </span>
        </div>

        <p className="offers-heading">Orders History</p>
        <div className="order-history-outer row">
          {this.state.customerDetails.orderHistory.length > 0 ?
            <React.Fragment>
              {this.state.customerDetails.orderHistory.map((val, index) =>
                <div key={index} className="col-md-3 no-padding">
                  <div className="order-history-box">
                    <div className="row">
                      <div className="col-md-3">
                        <img className="order-history-box-image" src={val.shopImage} />
                      </div>
                      <div className="col-md-9">
                        <p className="order-history-box-heading">{val.shopName}</p>
                        <p className="order-history-box-text-heading">{val.shopAddress}</p>
                      </div>
                    </div>
                    <hr />
                    <p className="mr-b-10"><span className="order-history-box-text-heading">Order Number :</span><span className="order-history-box-text">{val.orderNumber}</span></p>
                    <p className="mr-b-10"><span className="order-history-box-text-heading">Order Date :</span><span className="order-history-box-text">{moment(val.orderDate).format("DD MMM YYYY HH:mm")}</span></p>
                    <div className="text-center"><button type="button" onClick={() => this.detailsModalHandler(val)} className="order-history-box-btn"><span className="order-history-box-btn-text">View Details</span></button></div>
                  </div>
                </div>
              )}
            </React.Fragment>
            :
            <React.Fragment>
              <p className="no-shops-found-heading">No Orders Available</p>
              <img className="no-shops-found-image-order-history" src={require('../../assets/images/noDetailsFound.png')} />
              <img className="no-shops-found-image-glass-order-history" src={require('../../assets/images/glassIcon.png')} />
            </React.Fragment>
          }
        </div>

        {this.state.detailsModal && <div className="modal display-block">
          <div className="modal-dialog" role="document">
            <div className="modal-content order-history-modal">
              <div className="modal-header">
                <h5 className="modal-title confirm-modal-heading" id="exampleModalLabel">Order Details</h5>
                <button type="button" className="close confirm-modal-close" onClick={this.modalCloseHandler}>
                  <i className="fa fa-times-circle" aria-hidden="true"></i>
                </button>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <img className="order-history-box-image" src={this.state.modalDetailObject.shopImage} />
                </div>
                <div className="col-md-9">
                  <p className="order-history-box-heading">{this.state.modalDetailObject.shopName}</p>
                  <p className="order-history-box-text-heading">{this.state.modalDetailObject.shopAddress}</p>
                  <p className="order-history-box-text-heading">{this.state.modalDetailObject.shopMobileNumber}</p>
                </div>
              </div>
              <hr />
              <p className="order-history-modal-body-heading">Your Order</p>
              {this.state.modalDetailObject.orders.map((val, index) => {
                return <div key={index}>
                  <p className="order-history-modal-body-item-text">{val.item}</p>
                  <p className="order-history-modal-body-item-portion-text">{val.portion}</p>
                  <p className="order-history-modal-body-quantity-text">{val.quantity} X {val.price}<span className="order-history-modal-body-item-cost-text">{this.itemTotalHandler(val.price, val.quantity)}</span></p>
                </div>
              })}
              <p className="order-history-box-text-heading mr-t-40"> Item Total <span className="order-history-box-text"> {itemTotal}</span></p>
              <p className="order-history-box-text-heading">Coupon Code <span className="order-history-box-text"> {this.state.modalDetailObject.coupon}</span></p>
              <p className="order-history-box-text-heading">Total Discount <span className="order-history-box-text"> - {this.state.modalDetailObject.totalDiscount}</span></p>
              <p className="order-history-box-text-heading">Delivery Charge <span className="order-history-box-text"> + {this.state.modalDetailObject.area.slice(-2)}</span></p>
              <p className="order-history-box-text-heading text-color">Grand Total <span className="order-history-box-text"> {this.grandTotalBill(itemTotal, this.state.modalDetailObject.area.slice(-2), this.state.modalDetailObject.totalDiscount)}</span></p>
              <hr />
              <p className="order-history-box-text-heading">Order Number <span className="order-history-box-text"> {this.state.modalDetailObject.orderNumber}</span></p>
              <p className="order-history-box-text-heading">Payment <span className="order-history-box-text"> {this.state.modalDetailObject.paymentMethod}</span></p>
              <p className="order-history-box-text-heading">Date <span className="order-history-box-text"> {moment(this.state.modalDetailObject.orderDate).format("DD MMM YYYY HH : mm")}</span></p>
              <p className="order-history-box-text-heading">Phone Number <span className="order-history-box-text"> {this.state.customerDetails.mobileNumber}, {this.state.customerDetails.alternateMobileNumber}</span></p>
              <p className="order-history-box-text-heading">Deliver To <span className="order-history-box-text"> {this.state.customerDetails.address}</span></p>

            </div>
          </div>
        </div>}

      </div >
    );
  }
}

OrderHistoryPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  orderHistoryPage: makeSelectOrderHistoryPage(),
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

const withReducer = injectReducer({ key: 'orderHistoryPage', reducer });
const withSaga = injectSaga({ key: 'orderHistoryPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(OrderHistoryPage);
