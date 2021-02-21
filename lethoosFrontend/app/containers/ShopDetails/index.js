/**
 *
 * ShopDetails
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
import makeSelectShopDetails from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header/Loadable'
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { errorHandler } from "../../utils/customUtils";
import MessageModal from '../../components/MessageModal';

/* eslint-disable react/prefer-stateless-function */
export class ShopDetails extends React.PureComponent {

  state = {
    customerDetails: {},
    orderHistory: {
      orders: [],
      name: "",
      address: "",
      mobileNumber: "",
      image: "",
      _id: ""
    },
    shopDetails: {
      name: "",
      address: "",
      time: "",
      details: []
    },
    isLoader: true,
    confirmModal: false
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getShopDetails()
    }
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : cloneDeep(this.state.customerDetails);
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    let shopDetails = cloneDeep(this.state.shopDetails);
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }

    sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))
    this.setState({
      customerDetails,
      orderHistory,
      shopDetails
    })
  }

  itemsCountHandler = (val, id, index) => {
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    let shop = cloneDeep(this.state.shopDetails);

    if (orderHistory._id == shop._id || orderHistory._id == "") {
      let shopDetails = shop.details

      let orderHistoryIndex = orderHistory.orders.findIndex(value => value.itemNo === val.itemNo && value.isHalfSelected === val.isHalfSelected)

      if (val.isHalfSelected) {
        shopDetails[index].halfQuantity = id == "add" ? shopDetails[index].halfQuantity + 1 : shopDetails[index].halfQuantity - 1
      }
      else {
        shopDetails[index].quantity = id == "add" ? shopDetails[index].quantity + 1 : shopDetails[index].quantity - 1
      }

      if (val.isHalfSelected) {
        if (val.halfQuantity == 0) {
          orderHistory.orders.push(
            {
              itemNo: val.itemNo,
              item: val.name,
              halfQuantity: shopDetails[index].halfQuantity,
              price: val.halfPrice,
              isHalfSelected: val.isHalfSelected
            })
        }
        else {
          orderHistory.orders[orderHistoryIndex].itemNo = val.itemNo
          orderHistory.orders[orderHistoryIndex].item = val.name
          orderHistory.orders[orderHistoryIndex].halfQuantity = shopDetails[index].halfQuantity
          orderHistory.orders[orderHistoryIndex].price = val.halfPrice
          orderHistory.orders[orderHistoryIndex].isHalfSelected = val.isHalfSelected
        }
      }
      else {
        if (val.quantity == 0) {
          orderHistory.orders.push(
            {
              itemNo: val.itemNo,
              item: val.name,
              quantity: shopDetails[index].quantity,
              price: val.fullPrice,
              isHalfSelected: val.isHalfSelected
            })
        }
        else {
          orderHistory.orders[orderHistoryIndex].itemNo = val.itemNo
          orderHistory.orders[orderHistoryIndex].item = val.name
          orderHistory.orders[orderHistoryIndex].quantity = shopDetails[index].quantity
          orderHistory.orders[orderHistoryIndex].price = val.fullPrice
          orderHistory.orders[orderHistoryIndex].isHalfSelected = val.isHalfSelected
        }
      }

      shop.details = shopDetails

      orderHistory.orders.map((val, index) => {
        if (val.quantity == 0 || val.halfQuantity == 0) {
          orderHistory.orders.splice(index, 1)
        }
        return val
      })

      if (orderHistory.orders.length > 0) {
        orderHistory.mobileNumber = shop.mobileNumber
        orderHistory.name = shop.name
        orderHistory.address = shop.address
        orderHistory.image = shop.image
        orderHistory._id = shop._id
      }
      else {
        orderHistory.mobileNumber = ""
        orderHistory.name = ""
        orderHistory.address = ""
        orderHistory.image = ""
        orderHistory._id = ""
        orderHistory.total = 0
      }

      sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))
      this.setState({
        shopDetails: shop,
        orderHistory
      })
    }
    else {
      this.setState({
        confirmModal: true
      })

    }
  }

  modalCloseHandler = () => {
    setTimeout(() => {
      this.setState({
        isMessageModal: false
      })
    }, 1000);
  }

  getShopDetails = () => {
    let url = window.API_URL + `/shop/${this.props.match.params.id}`;
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    axios.get(url)
      .then((res) => {
        let shopDetails = res.data;
        shopDetails.details.map(val => { val.quantity = 0; val.isHalfSelected = false; val.halfQuantity = 0 })
        if (orderHistory.orders.length > 0 && orderHistory._id == this.props.match.params.id) {

          shopDetails.details.map(val => {
            orderHistory.orders.map(value => {
              if (val.itemNo === value.itemNo && value.isHalfSelected) {
                val.halfQuantity = value.halfQuantity ? value.halfQuantity : 0
              }
              else if (val.itemNo === value.itemNo) {
                val.quantity = value.quantity ? value.quantity : 0
              }
              return value
            })
            return val
          })

        }
        this.setState({ shopDetails, isLoader: false });
      })
      .catch((error) => {
        this.setState({
          isLoader: false,
          message: "Some Error Occured",
          isMessageModal: true,
          type: "failure"
        })
      });
  };

  billTotal = () => {
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    let total = 0
    orderHistory.orders.map(val => {
      if (val.isHalfSelected) {
        total += parseInt(val.price) * parseInt(val.halfQuantity)
      }
      else {
        total += parseInt(val.price) * parseInt(val.quantity)
      }
    })
    orderHistory.total = total
    sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))
    return total
  }

  modalCloseHandler = () => {
    this.setState({
      confirmModal: false
    })
  }

  orderReplacedHandler = () => {
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    orderHistory.mobileNumber = ""
    orderHistory.name = ""
    orderHistory.address = ""
    orderHistory.image = ""
    orderHistory._id = ""
    orderHistory.orders = []
    orderHistory.total = 0
    orderHistory._id = ""
    sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))
    this.setState({
      orderHistory,
      confirmModal: false
    })
  }

  halfPriceHandler = (event) => {
    let checked = event.target.checked
    let id = event.target.id
    let shopDetails = cloneDeep(this.state.shopDetails);

    shopDetails.details[id].isHalfSelected = checked

    this.setState({
      shopDetails
    })
  }

  deleteMultipleItemHandler = (index) => {
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);

    let shopDetails = cloneDeep(this.state.shopDetails);

    orderHistory.orders[index].isHalfSelected ? orderHistory.orders[index].halfQuantity = orderHistory.orders[index].halfQuantity - 1 : orderHistory.orders[index].quantity = orderHistory.orders[index].quantity - 1

    let shopDetailsIndex = shopDetails.details.findIndex(val => val.itemNo == orderHistory.orders[index].itemNo)

    if (orderHistory.orders[index].isHalfSelected) {
      shopDetails.details[shopDetailsIndex].halfQuantity = shopDetails.details[shopDetailsIndex].halfQuantity - 1
    }
    else {
      shopDetails.details[shopDetailsIndex].quantity = shopDetails.details[shopDetailsIndex].quantity - 1
    }

    orderHistory.orders.map((val, index) => {
      if (val.quantity == 0 || val.halfQuantity == 0) {
        orderHistory.orders.splice(index, 1)
      }
      return val
    })

    orderHistory.mobileNumber = ""
    orderHistory.name = ""
    orderHistory.address = ""
    orderHistory.image = ""
    orderHistory._id = ""
    orderHistory.total = 0

    sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))

    this.setState({
      orderHistory,
      shopDetails
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>ShopDetails</title>
          <meta name="description" content="Description of ShopDetails" />
        </Helmet>

        <Header />

        <div className="shop-header">
          <p className="shop-header-name">{this.state.shopDetails.name}</p>
          <p className="shop-header-address mr-t-25">{this.state.shopDetails.address}</p>
          <p className="shop-header-time">{this.state.shopDetails.time}</p>
          {!this.state.shopDetails.status && !this.state.isLoader && this.state.type != 'failure' && <div className="shopDetails-closed-tag">Closed</div>}
          <img className="shop-header-image img-responsive" src={this.state.shopDetails.image} />
        </div>

        <div className="shop-details-outer row">
          {this.state.isLoader ?
            <div className="lds-dual-ring"></div>
            :
            this.state.shopDetails.details.length > 0 ?
              <React.Fragment>
                <div className="menu-items-outer col-md-8">
                  {this.state.shopDetails.details.map((val, index) => {
                    return <div key={index} className="menu-items">
                      <img className="menu-items-image img-responsive" src={val.image} />
                      <p className="menu-items-name"> {val.name}</p>
                      <div><span className="menu-items-price"> {val.fullPrice}</span>{val.halfAvailable && <React.Fragment><span className="menu-items-half-text">Half -</span><span className="menu-items-half-price"> {val.halfPrice}</span><span className="mob-view-checkbox"><span className="menu-items-half-text">Check mark for Half</span><span><input type="checkbox" id={index} checked={val.isHalfSelected} className="menu-items-half-price-radioBox mob-left-10" onChange={this.halfPriceHandler} /></span></span></React.Fragment>}</div>
                      {(val.quantity + val.halfQuantity) > 0 ?
                        <div className="menu-items-count-button">

                          {/* <span onClick={() => this.state.shopDetails.status && !(this.state.orderHistory.orders.filter(value => value.itemNo === val.itemNo) && this.state.orderHistory.orders.filter(value => value.itemNo === val.itemNo).length > 1) ? this.itemsCountHandler(val, "sub", index) : ""} className={this.state.shopDetails.status && !(this.state.orderHistory.orders.filter(value => value.itemNo === val.itemNo) && this.state.orderHistory.orders.filter(value => value.itemNo === val.itemNo).length > 1) ? "menu-items-count-left-button" : "menu-items-count-left-button disabled"}>-</span> */}

                          <span className="mr-l-20">{val.quantity + val.halfQuantity}</span>

                          <span onClick={() => this.state.shopDetails.status ? this.itemsCountHandler(val, "add", index) : ""} className="menu-items-count-right-button">+</span>
                        </div>
                        :
                        <div onClick={() => this.state.shopDetails.status ? this.itemsCountHandler(val, "add", index) : ""} className="menu-items-add-button">Add</div>
                      }
                    </div>
                  }
                  )}
                </div>
                <div className="cart-items col-md-4">
                  {
                    this.state.orderHistory.orders.length > 0 ?
                      <React.Fragment>
                        <div className="order-details-heading">order Details</div>
                        <hr />
                        {this.state.orderHistory.orders.map((val, index) => {

                          return <div key={index} className="order-details-items">
                            {val.isHalfSelected ?
                              <React.Fragment>{<span onClick={() => this.deleteMultipleItemHandler(index)} className="shop-details-minus-btn"><i className="fa fa-minus-square-o" aria-hidden="true"></i></span>}<span className="font-size-30">{val.item} X {val.halfQuantity}</span> <span className="float-right">{val.price * val.halfQuantity}</span><span>(Half)</span></React.Fragment>
                              :
                              <React.Fragment>{<span onClick={() => this.deleteMultipleItemHandler(index)} className="shop-details-minus-btn"><i className="fa fa-minus-square-o" aria-hidden="true"></i></span>}<span className="font-size-30">{val.item} X {val.quantity}</span> <span className="float-right">{val.price * val.quantity}</span></React.Fragment>
                            }
                          </div>
                        })}
                        <hr />
                        <div className="order-details-heading">Total <span className="float-right">{this.billTotal()}</span></div>
                        <button onClick={() => this.props.history.push('/checkoutPage')} className="btn btn-warning login-button checkout-button">Go To Cart</button>
                      </React.Fragment>
                      :
                      <img className="empty-cart-image img-responsive" src={require('../../assets/images/emptyCart.png')} />
                  }
                </div>
              </React.Fragment>
              :
              <React.Fragment>
                <p className="offers-not-found-text1-shop-details">No Information Available</p>
                <img className="offers-not-found-shop-details" src={require('../../assets/images/notFoundOffers.png')} />
              </React.Fragment>
          }
        </div>
        {
          this.state.confirmModal && <div className="modal display-block">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title confirm-modal-heading" id="exampleModalLabel">Items already in cart</h5>
                  <button type="button" className="close confirm-modal-close" onClick={this.modalCloseHandler}>
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                  </button>
                </div>
                <div className="modal-body confirm-modal-body">
                  Your cart contains items from other restaurant.
              </div>
                <div className="modal-body confirm-modal-body-2">
                  Would you like to reset your cart for adding items from this restaurant?.
              </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary confirm-modal-no" onClick={this.modalCloseHandler}>No</button>
                  <button type="button" className="btn btn-primary confirm-modal-yes" onClick={this.orderReplacedHandler}>Yes</button>
                </div>
              </div>
            </div>
          </div>
        }
        {this.state.isMessageModal && <MessageModal
          modalType={this.state.type}
          message={this.state.message}
          onClose={this.modalCloseHandler}
        />}
      </div >
    );
  }
}

ShopDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  shopDetails: makeSelectShopDetails(),
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

const withReducer = injectReducer({ key: 'shopDetails', reducer });
const withSaga = injectSaga({ key: 'shopDetails', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ShopDetails);
