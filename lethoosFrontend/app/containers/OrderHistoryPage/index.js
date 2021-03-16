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
import Header from '../../components/Header/Loadable'
import axios from 'axios';
import messages from './messages';
import moment from 'moment';
import { errorHandler } from "../../utils/customUtils";
import MessageModal from '../../components/MessageModal';

var itemTotal = 0
/* eslint-disable react/prefer-stateless-function */
export class OrderHistoryPage extends React.PureComponent {

  state = {
    customerDetails: {},
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
    }, () => this.customerDetailsHandler())
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

  customerDetailsHandler = () => {
    let url = window.API_URL + `/customerLogin/${this.state.customerDetails._id}`;
    axios.get(url)
      .then((res) => {
        const customerDetails = res.data;
        sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails))
        this.setState({
          customerDetails,
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
          <title>OrderHistoryPage</title>
          <meta name="description" content="Description of OrderHistoryPage" />
        </Helmet>

        <Header />

        <p className="offers-heading">Orders History</p>
        <div className="order-history-outer row">
          {this.state.isLoader ?
            <div className="lds-dual-ring"></div>
            :
            this.state.customerDetails.orderHistory.length > 0 && this.state.type === "success" ?
              <React.Fragment>
                {this.state.customerDetails.orderHistory.map((val, index) =>
                  <div key={index} className="col-md-3 no-padding">
                    {val.isOrderCancel && < img className="order-cancel-img" src={require('../../assets/images/cancel.png')} />}
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
              <p className="order-history-modal-body-heading">Your Order</p>
              {this.state.modalDetailObject.orders.map((val, index) => {
                return <div key={index}>
                  <p className="order-history-modal-body-item-portion-text">{val.portion}</p>
                  {val.isHalfSelected ?
                    <React.Fragment><span className="order-history-modal-body-quantity-text">{val.item} X {val.halfQuantity}</span> <span className="order-history-modal-body-item-cost-text">{val.price * val.halfQuantity}</span><span>(Half)</span></React.Fragment>
                    :
                    <React.Fragment><span className="order-history-modal-body-quantity-text">{val.item} X {val.quantity}</span> <span className="order-history-modal-body-item-cost-text">{val.price * val.quantity}</span></React.Fragment>
                  }
                </div>
              })}
              <p className="order-history-box-text-heading mr-t-15">Other Specifications</p>
              <p className="order-history-box-specification-text">{this.state.modalDetailObject.otherSpecifications ? this.state.modalDetailObject.otherSpecifications : "NA"}</p>
              <p className="order-history-box-text-heading mr-t-45"> Item Total <span className="order-history-box-text"> {this.state.modalDetailObject.total}</span></p>
              <p className="order-history-box-text-heading">Coupon Code <span className="order-history-box-text"> {this.state.modalDetailObject.coupon.length > 0 ? this.state.modalDetailObject.coupon : "NA"}</span></p>
              <p className="order-history-box-text-heading">Total Discount <span className="order-history-box-text"> - {this.state.modalDetailObject.totalDiscount}</span></p>
              <p className="order-history-box-text-heading">Delivery Charge <span className="order-history-box-text"> + {this.state.modalDetailObject.area.slice(-2)}</span></p>
              <p className="order-history-box-text-heading text-color">Grand Total <span className="order-history-box-text"> {this.grandTotalBill(this.state.modalDetailObject.total, this.state.modalDetailObject.area.slice(-2), this.state.modalDetailObject.totalDiscount)}</span></p>
              <hr />
              <p className="order-history-box-text-heading">Order Number <span className="order-history-box-text"> {this.state.modalDetailObject.orderNumber}</span></p>
              <p className="order-history-box-text-heading">Payment <span className="order-history-box-text"> {this.state.customerDetails.paymentMethod}</span></p>
              <p className="order-history-box-text-heading">Date <span className="order-history-box-text"> {moment(this.state.modalDetailObject.orderDate).format("DD MMM YYYY HH : mm")}</span></p>
              <p className="order-history-box-text-heading">Phone Number <span className="order-history-box-text"> {this.sameMobileNumberCheckHandler(this.state.customerDetails.mobileNumber, this.state.modalDetailObject.orderAlternateMobileNumber)}</span></p>
              <p className="order-history-box-text-heading">Deliver To</p>
              <p className="order-history-box-specification-text">{this.state.modalDetailObject.orderAddress}</p>
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
