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

    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }

    sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))
    this.setState({
      customerDetails,
      orderHistory
    })
  }

  itemsCountHandler = (val, id, index) => {
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    let shop = cloneDeep(this.state.shopDetails)

    if (orderHistory._id == shop._id || orderHistory._id == "") {
      let shopDetails = cloneDeep(this.state.shopDetails).details

      let orderHistoryIndex = orderHistory.orders.findIndex(value => value.itemNo === val.itemNo)

      if (val.portion === "half") {
        shopDetails[index].halfQuantity = id == "add" ? shopDetails[index].halfQuantity + 1 : shopDetails[index].halfQuantity - 1
      }
      else {
        shopDetails[index].quantity = id == "add" ? shopDetails[index].quantity + 1 : shopDetails[index].quantity - 1
      }

      if (orderHistoryIndex === -1) {
        orderHistory.orders.push(
          {
            itemNo: val.itemNo,
            item: val.name,
            [val.portion === "half" ? "halfQuantity" : "quantity"]: val.portion === "half" ? shopDetails[index].halfQuantity : shopDetails[index].quantity,
            portion: val.portion,
            price: val.portion == "half" ? val.halfPrice : val.fullPrice,
          })
      }
      else if (val.portion === "half" && val.halfQuantity == 0) {
        orderHistory.orders.push(
          {
            itemNo: val.itemNo,
            item: val.name,
            halfQuantity: shopDetails[index].halfQuantity,
            portion: val.portion,
            price: val.halfPrice,
          }
        )
      }
      else if (val.portion === "full" && val.quantity == 0) {
        orderHistory.orders.push(
          {
            itemNo: val.itemNo,
            item: val.name,
            quantity: shopDetails[index].quantity,
            portion: val.portion,
            price: val.fullPrice,
          }
        )
      }
      else {

        orderHistory.orders = [
          {
            itemNo: shopDetails[index].itemNo,
            item: shopDetails[index].name,
            halfQuantity: shopDetails[index].halfQuantity,
            portion: "half",
            price: shopDetails[index].halfPrice
          },
          {
            itemNo: shopDetails[index].itemNo,
            item: shopDetails[index].name,
            quantity: shopDetails[index].quantity,
            portion: "full",
            price: shopDetails[index].fullPrice
          },
        ]

        // for (let i = 0; i < shopDetails[index].halfQuantity; i++) {

        //   ob.push({
        //     itemNo: val.itemNo,
        //     item: val.name,
        //     halfQuantity: shopDetails[index].halfQuantity,
        //     portion: val.portion,
        //     price: val.halfPrice
        //   })

        // }

        // for (let i = 0; i < shopDetails[index].quantity; i++) {

        //   ob.push({
        //     itemNo: val.itemNo,
        //     item: val.name,
        //     quantity: shopDetails[index].quantity,
        //     portion: val.portion,
        //     price: val.halfPrice
        //   })

        // }

        // console.log('ob: ', ob);

        // console.log('orderHistory.orders: ', orderHistory.orders);
        // let ob = orderHistory.orders
        // ob.push({
        //   itemNo: val.itemNo,
        //   item: val.name,
        //   [val.portion == "half" ? "halfQuantity" : "quantity"]: val.portion = "half" ? shopDetails[index].halfQuantity : shopDetails[index].quantity,
        //   portion: val.portion,
        //   price: val.portion == "half" ? val.halfPrice : val.fullPrice
        // })


        // orderHistory.orders = ob
        // if (value1.portion == "half") {
        //   orderHistory.orders[orderHistoryIndex].itemNo = val.itemNo
        //   orderHistory.orders[orderHistoryIndex].item = val.name
        //   orderHistory.orders[orderHistoryIndex].halfQuantity = shopDetails[index].halfQuantity
        //   orderHistory.orders[orderHistoryIndex].portion = val.portion
        //   orderHistory.orders[orderHistoryIndex].price = val.halfPrice
        // }
        // else {
        //   orderHistory.orders[orderHistoryIndex].itemNo = val.itemNo
        //   orderHistory.orders[orderHistoryIndex].item = val.name
        //   orderHistory.orders[orderHistoryIndex].quantity = shopDetails[index].quantity
        //   orderHistory.orders[orderHistoryIndex].portion = val.portion
        //   orderHistory.orders[orderHistoryIndex].price = val.fullPrice
        // }
      }

      shop.details = shopDetails

      orderHistory.orders.map((val, index) => {
        if (val.quantity == 0) {
          orderHistory.orders.splice(index, 1)
        }
        else if (val.halfQuantity == 0) {
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

  getShopDetails = () => {
    let url = window.API_URL + `/shop/${this.props.match.params.id}`;
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    axios.get(url)
      .then((res) => {
        let shopDetails = res.data;
        shopDetails.details.map(val => { val.quantity = 0; val.portion = "full"; val.halfQuantity = 0 })
        if (orderHistory.orders.length > 0) {
          shopDetails.details.map(val => {
            orderHistory.orders.map(value => {
              if (val.itemNo === value.itemNo) {
                val.quantity = value.quantity ? value.quantity : 0
                val.halfQuantity = value.halfQuantity ? value.halfQuantity : 0
                val.portion = value.portion
              }
            })
          })
        }
        this.setState({ shopDetails, isLoader: false });
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });
  };

  billTotal = () => {
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    let total = 0
    orderHistory.orders.map(val => {
      val.portion === "half" ?
        total += val.price * val.halfQuantity
        :
        total += val.price * val.quantity
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
    let shopDetails = cloneDeep(this.state.shopDetails)
    shopDetails.details[id].portion = checked ? "half" : "full"

    this.setState({
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
          {!this.state.shopDetails.status && <div className="shopDetails-closed-tag">Closed</div>}
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
                      <div><span className="menu-items-price"> {val.fullPrice}</span>{val.halfAvailable && <React.Fragment><span className="menu-items-half-text">Half -</span><span className="menu-items-half-price"> {val.halfPrice}</span><span className="menu-items-half-text">Check mark for Half</span><span><input type="checkbox" id={index} checked={val.portion === "half"} className="menu-items-half-price-checkbox" onChange={this.halfPriceHandler} /></span></React.Fragment>}</div>
                      {val.quantity > 0 || val.halfQuantity > 0 ?
                        <div className="menu-items-count-button">
                          <span onClick={() => this.state.shopDetails.status ? this.itemsCountHandler(val, "sub", index) : ""} className="menu-items-count-left-button">-</span>
                          <span>{val.quantity + val.halfQuantity}</span>
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
                            {val.portion === "half" ?
                              <React.Fragment><span>{val.item} X {val.halfQuantity}</span> <span className="float-right">{val.price * val.halfQuantity}</span></React.Fragment>
                              :
                              <React.Fragment><span>{val.item} X {val.quantity}</span> <span className="float-right">{val.price * val.quantity}</span></React.Fragment>
                            }
                            <span>{val.portion == "half" && "(Half)"}</span>
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
        {this.state.confirmModal && <div className="modal display-block">
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
        </div>}
      </div>
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
