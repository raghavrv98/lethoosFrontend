/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Route, Switch } from 'react-router-dom';
import makeSelectHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';

import LandingPage from '../../containers/LandingPage/Loadable';
import LoginPage from '../../containers/LoginPage/Loadable';
import ShopDetails from '../../containers/shopDetails/Loadable';
import CheckoutPage from '../../containers/checkoutPage/Loadable';
import OrderPlacedPage from '../../containers/OrderPlacedPage/Loadable';
import OffersPage from '../../containers/OffersPage/Loadable';
import { capitalizeFirstLetter } from '../../utils/customUtils'

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {

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
      <React.Fragment>
        {/* { Object.keys(this.state.customerDetails).length == 0 ? null : < div className="header sticky-top">
          <img className="logo" src={require('../../assets/images/logo.png')} />
          <p className="logo-text">Le Thoos</p>
          <span className="nav-items">
            <span className="nav-mr" onClick={() => this.props.history.push('/offersPage')}><i className="fa fa-tags" aria-hidden="true"></i> Offers</span>
            <span className="nav-mr"><i className="fa fa-history" aria-hidden="true"></i> Order History</span>
            <span className="nav-mr"><i className="fa fa-user" aria-hidden="true"></i> {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</span>
            <span className="nav-mr" onClick={() => { sessionStorage.clear(); this.props.history.push('/login') }}><i className="fa fa-power-off" aria-hidden="true"></i> Logout</span>
          </span>
        </div>} */}
        <Switch>
          <Route exact path="/landingPage" render={props => <LandingPage {...props} />} />
          <Route exact path="/login" render={props => <LoginPage {...props} />} />
          <Route exact path="/shopDetails/:id" render={props => <ShopDetails {...props} />} />
          <Route exact path="/checkoutPage" render={props => <CheckoutPage {...props} />} />
          <Route exact path="/orderPlacedPage" render={props => <OrderPlacedPage {...props} />} />
          <Route exact path="/offersPage" render={props => <OffersPage {...props} />} />
        </Switch>
      </React.Fragment >
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
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

const withReducer = injectReducer({ key: 'homePage', reducer });
const withSaga = injectSaga({ key: 'homePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
