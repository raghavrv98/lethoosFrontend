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
import { capitalizeFirstLetter } from '../../utils/customUtils'
import axios from 'axios';
import { cloneDeep } from 'lodash';

/* eslint-disable react/prefer-stateless-function */
export class ShopDetails extends React.PureComponent {

  state = {
    customerDetails: {},
    orderHistory: {
      orders: [],
      name: "",
      address: ""
    },
    shopDetails: {
      name: "",
      address: "",
      time: "",
      details: []
    },
    quantity: 0
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

    orderHistory.name = this.state.shopDetails.name
    orderHistory.address = this.state.shopDetails.address

    sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))
    this.setState({
      customerDetails,
      orderHistory
    })
  }

  itemsCountHandler = (val, id) => {
    let shop = cloneDeep(this.state.shopDetails)
    let shopDetails = cloneDeep(this.state.shopDetails).details
    let shopDetailsIndex = shopDetails.findIndex(value => value.itemNo === val.itemNo)
    shopDetails[shopDetailsIndex].quantity = id == "add" ? shopDetails[shopDetailsIndex].quantity + 1 : shopDetails[shopDetailsIndex].quantity - 1
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);

    let orderHistoryIndex = orderHistory.orders.findIndex(value => value.itemNo === val.itemNo)

    if (orderHistoryIndex === -1) {
      orderHistory.orders.push(
        {
          itemNo: val.itemNo,
          item: val.name,
          quantity: shopDetails[shopDetailsIndex].quantity,
          portion: val.portion,
          price: val.halfAvailable ? val.halfPrice : val.fullPrice,
        }
      )
    }
    else {
      orderHistory.orders[orderHistoryIndex].itemNo = val.itemNo
      orderHistory.orders[orderHistoryIndex].item = val.name
      orderHistory.orders[orderHistoryIndex].quantity = shopDetails[shopDetailsIndex].quantity
      orderHistory.orders[orderHistoryIndex].portion = val.portion
      orderHistory.orders[orderHistoryIndex].price = val.halfAvailable ? val.halfPrice : val.fullPrice
    }

    shop.details = shopDetails
    orderHistory.orders.map((val, index) => {
      if (val.quantity == 0) {
        orderHistory.orders.splice(index, 1)
      }
      return val
    })

    sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))
    this.setState({
      shopDetails: shop,
      orderHistory
    })

  }

  getShopDetails = () => {
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    let url = window.API_URL + `/shop/${this.props.match.params.id}`;
    axios.get(url)
      .then((res) => {
        let shopDetails = res.data;
        shopDetails.details.map(val => { val.quantity = 0; val.portion = "full" })

        orderHistory.name = shopDetails.name
        orderHistory.address = shopDetails.address

        sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))

        this.setState({ shopDetails });
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
      total += val.price * val.quantity
    })
    orderHistory.total = total
    sessionStorage.setItem('orderHistory', JSON.stringify(orderHistory))
    return total
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>ShopDetails</title>
          <meta name="description" content="Description of ShopDetails" />
        </Helmet>
        <div className="header sticky-top">
          <img className="logo" src={require('../../assets/images/logo.png')} />
          <p className="logo-text">Le Thoos</p>
          <span className="nav-items">
          <span className="nav-mr" onClick={() => this.props.history.push('/landingPage')}><i className="fa fa-home" aria-hidden="true"></i> Shops</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/offersPage')}><i className="fa fa-tags" aria-hidden="true"></i> Offers</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/orderHistoryPage')}><i className="fa fa-history" aria-hidden="true"></i> Order History</span>
            <span className="nav-mr"><i className="fa fa-user" aria-hidden="true"></i> {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/checkoutPage')}><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart</span>
            <span className="nav-mr" onClick={() => { sessionStorage.clear(); this.props.history.push('/login') }}><i className="fa fa-power-off" aria-hidden="true"></i> Logout</span>
          </span>
        </div>

        <div className="shop-header">
          <p className="shop-header-name">{this.state.shopDetails.name}</p>
          <p className="shop-header-address mr-t-25">{this.state.shopDetails.address}</p>
          <p className="shop-header-time">{this.state.shopDetails.time}</p>
          <img className="shop-header-image img-responsive" src={this.state.shopDetails.image} />
        </div>

        <div className="shop-details-outer row">
          <div className="menu-items-outer col-md-8">
            {this.state.shopDetails.details && this.state.shopDetails.details.map((val, index) =>
              <div key={index} className="menu-items">
                <img className="menu-items-image img-responsive" src={val.image} />
                <p className="menu-items-name"> {val.name}</p>
                <p className="menu-items-price"> {val.fullPrice}</p>
                {val.quantity > 0 ?
                  <div className="menu-items-count-button"><span onClick={() => this.itemsCountHandler(val, "sub")} className="menu-items-count-left-button">-</span><span>{val.quantity}</span><span onClick={() => this.itemsCountHandler(val, "add")} className="menu-items-count-right-button">+</span></div>
                  :
                  <div onClick={() => this.itemsCountHandler(val, "add")} className="menu-items-add-button">Add</div>
                }
              </div>
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
                      {val.item} X {val.quantity} = {val.price * val.quantity}
                    </div>
                  })}
                  <hr />
                  <div className="order-details-heading">Total = {this.billTotal()}</div>
                  <button onClick={() => this.props.history.push('/checkoutPage')} className="btn btn-warning login-button checkout-button">Go To Cart</button>
                </React.Fragment>
                :
                <img className="empty-cart-image img-responsive" src={require('../../assets/images/emptyCart.png')} />
            }
          </div>
        </div>
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
