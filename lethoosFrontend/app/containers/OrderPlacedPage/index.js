/**
 *
 * OrderPlacedPage
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
import makeSelectOrderPlacedPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { capitalizeFirstLetter } from '../../utils/customUtils'
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class OrderPlacedPage extends React.PureComponent {

  state = {
    customerDetails: {}
  }

  componentWillMount() {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }
    this.setState({
      customerDetails
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>OrderPlacedPage</title>
          <meta name="description" content="Description of OrderPlacedPage" />
        </Helmet>
        <div className="header sticky-top">
          <img className="logo" src={require('../../assets/images/logo.png')} />
          <p className="logo-text">Le Thoos</p>
          <span className="nav-items">
          <span className="nav-mr" onClick={() => this.props.history.push('/landingPage')}><i className="fa fa-home" aria-hidden="true"></i> Shops</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/offersPage')}><i className="fa fa-tags" aria-hidden="true"></i> Offers</span>
            {/* <span className="nav-mr"><i className="fa fa-history" aria-hidden="true"></i> Order History</span> */}
            <span className="nav-mr"><i className="fa fa-user" aria-hidden="true"></i> {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/checkoutPage')}><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart</span>
            <span className="nav-mr" onClick={() => { sessionStorage.clear(); this.props.history.push('/login') }}><i className="fa fa-power-off" aria-hidden="true"></i> Logout</span>
          </span>
        </div>
        <div className="order-placed-outer">
          <h1>{this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}, Your Order has been successfully placed.</h1>
          <div className="order-placed-box">
            <img className="order-placed-image" src={require('../../assets/images/orderPlaced.png')} />
            <p className="order-placed-text">Preparing your Order.</p>
            <p className="order-placed-text">Your Order will be prepared and will come soon.</p>
            <div className="form-group">
              <button type="submit" className="btn btn-warning login-button order-placed-btn">Order History</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OrderPlacedPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  orderPlacedPage: makeSelectOrderPlacedPage(),
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

const withReducer = injectReducer({ key: 'orderPlacedPage', reducer });
const withSaga = injectSaga({ key: 'orderPlacedPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(OrderPlacedPage);
