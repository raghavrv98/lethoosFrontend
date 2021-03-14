/**
 *
 * OrderDetails
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
import makeSelectOrderDetails from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header/Loadable'
import axios from 'axios';
import moment from 'moment';
import { errorHandler } from "../../utils/customUtils";
import MessageModal from '../../components/MessageModal';
var itemTotal = 0

/* eslint-disable react/prefer-stateless-function */
export class OrderDetails extends React.PureComponent {
  state = {
    customerDetails: {},
    couponIdCopy: "",
    detailsModal: false,
    isLoader: true,
    type: "success"
  }

  componentWillMount() {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }
    this.setState({
      customerDetails
    }, () => this.orderDetailsHandler())
  }

  detailsModalHandler = (val) => {
    itemTotal = 0
    this.setState({
      detailsModal: true,
      modalDetailObject: val
    })
  }

  grandTotalBill = (totalBill, delivery, discount) => {
    return (parseInt(totalBill) + parseInt(delivery)) - parseInt(discount)
  }

  orderDetailsHandler = () => {
    let url = window.API_URL + `/orderDetails`;
    axios.get(url)
      .then((res) => {
        const orderDetails = res.data.reverse();
        this.setState({
          orderDetails,
          isLoader: false
        })
      })
      .catch((error) => {
        this.setState({
          isLoader: false,
          message: "Some Error Occured",
          isMessageModal: true,
          type: "failure"
        })
      });
  }

  modalCloseHandler = () => {
    setTimeout(() => {
      this.setState({
        isMessageModal: false
      })
    }, 1000);
  }

  sameMobileNumberCheckHandler = (mobileNumber, alternateMobileNumber) => {
    if (alternateMobileNumber === mobileNumber) {
      return alternateMobileNumber
    }
    else {
      return `${mobileNumber}, ${alternateMobileNumber}`
    }
  }

  detailsModalCloseHandler = () => {
    this.setState({
      detailsModal: false
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>OrderDetailsPage</title>
          <meta name="description" content="Description of OrderHistoryPage" />
        </Helmet>

        <Header />

        <p className="offers-heading">Daily Orders Details ({this.state.orderDetails && this.state.orderDetails.length})</p>
        <div className="order-history-outer row">
          {this.state.isLoader ?
            <div className="lds-dual-ring"></div>
            :
            this.state.orderDetails.length > 0 ?
              <React.Fragment>
                {this.state.orderDetails.map((val, index) =>
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
                      <p className="mr-b-10"><span className="order-history-box-text-heading">Order Number :</span><span className="order-history-box-text">{val.customerOrderNumber}</span></p>
                      <p className="mr-b-10"><span className="order-history-box-text-heading">Order Date :</span><span className="order-history-box-text">{val.customerOrderDate ? moment(val.customerOrderDate).format("DD MMM YYYY HH : mm") : "NA"}</span></p>
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
            <button type="button" className="close confirm-modal-close" onClick={this.detailsModalCloseHandler}>
              <i className="fa fa-times-circle" aria-hidden="true"></i>
            </button>
            <div className="modal-content order-history-modal">
              <div className="modal-header">
                <h5 className="modal-title confirm-modal-heading" id="exampleModalLabel">Order Details</h5>
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
              <p className="order-history-modal-body-heading">Customer Order</p>
              {this.state.modalDetailObject.customerOrders.map((val, index) => <p className="font-size-30" key={index}>{val}</p>)}
              <p className="order-history-box-text-heading mr-t-15">Other Specifications</p>
              <p className="order-history-box-specification-text">{this.state.modalDetailObject.orderSpecifications ? this.state.modalDetailObject.orderSpecifications : "NA"}</p>
              <p className="order-history-box-text-heading mr-t-45"> Item Total <span className="order-history-box-text"> {this.state.modalDetailObject.customerTotalAmount - this.state.modalDetailObject.customerDeliveryCharges}</span></p>
              <p className="order-history-box-text-heading">Coupon Code <span className="order-history-box-text"> {this.state.modalDetailObject.customerCoupon ? this.state.modalDetailObject.customerCoupon : "NA"}</span></p>
              <p className="order-history-box-text-heading">Total Discount <span className="order-history-box-text"> - {this.state.modalDetailObject.customerTotalDiscount}</span></p>
              <p className="order-history-box-text-heading">Delivery Charge <span className="order-history-box-text"> + {this.state.modalDetailObject.customerDeliveryCharges}</span></p>
              <p className="order-history-box-text-heading text-color">Grand Total <span className="order-history-box-text"> {this.state.modalDetailObject.customerTotalAmount}</span></p>
              <hr />
              <p className="order-history-box-text-heading">Order Number <span className="order-history-box-text"> {this.state.modalDetailObject.customerOrderNumber}</span></p>
              <p className="order-history-box-text-heading">Payment <span className="order-history-box-text"> {this.state.modalDetailObject.customerPaymentMethod}</span></p>
              <p className="order-history-box-text-heading">Date <span className="order-history-box-text"> {this.state.modalDetailObject.customerOrderDate ? moment(this.state.modalDetailObject.customerOrderDate).format("DD MMM YYYY HH : mm") : "NA"}</span></p>
              <p className="order-history-box-text-heading">Phone Number <span className="order-history-box-text"> {this.sameMobileNumberCheckHandler(this.state.modalDetailObject.customerNumber, this.state.modalDetailObject.customerCallingNumber)}</span></p>
              <p className="order-history-box-text-heading">Deliver To</p>
              <p className="order-history-box-specification-text">{this.state.modalDetailObject.customerAddress}</p>
              <p className="order-history-box-text-heading">Delivery Agent Name <span className="order-history-box-text">Pawan Singh</span></p>
              <p className="order-history-box-text-heading">Delivery Agent Phone Number <span className="order-history-box-text"> 8439395179</span></p>
            </div>
          </div>
        </div>}
        {this.state.isMessageModal && <MessageModal
          modalType={this.state.type}
          message={this.state.message}
          onClose={this.modalCloseHandler}
        />}
      </div >
    );
  }
}

OrderDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  orderDetails: makeSelectOrderDetails(),
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

const withReducer = injectReducer({ key: 'orderDetails', reducer });
const withSaga = injectSaga({ key: 'orderDetails', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(OrderDetails);
