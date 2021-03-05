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
import ShopDetails from '../../containers/ShopDetails/Loadable';
import CheckoutPage from '../../containers/CheckoutPage/Loadable';
import OrderPlacedPage from '../../containers/OrderPlacedPage/Loadable';
import OffersPage from '../../containers/OffersPage/Loadable';
import OrderHistoryPage from '../../containers/OrderHistoryPage/Loadable';
import ProfilePage from '../../containers/ProfilePage/Loadable';
import AdminPage from '../../containers/AdminPage/Loadable';
import NotFoundPage from '../../components/NotFoundPage/Loadable'

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {

  state = {
    customerDetails: {},
    isLoading: true
  }

  componentWillMount() {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }
    this.setState({
      customerDetails,
    })
    this.refreshAt(14, 0, 0);
    this.refreshAt(20, 0, 0);
  }

  // auto reload for checking shop status

  refreshAt = (hours, minutes, seconds) => {
    var now = new Date();
    var then = new Date();

    if (now.getHours() > hours ||
      (now.getHours() == hours && now.getMinutes() > minutes) ||
      now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
      then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);

    var timeout = (then.getTime() - now.getTime());
    setTimeout(() => { window.location.reload(true); }, timeout);
  }


  render() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 1000);

    return (
      <React.Fragment>
        {this.state.isLoading ?
          <div className="lds-dual-ring"></div> :
          <Switch>
            <Route exact path="/landingPage" render={props => <LandingPage {...props} />} />
            <Route exact path="/login" render={props => <LoginPage {...props} />} />
            <Route exact path="/" render={props => <LoginPage {...props} />} />
            <Route exact path="/shopDetails/:id" render={props => <ShopDetails {...props} />} />
            <Route exact path="/checkoutPage" render={props => <CheckoutPage {...props} />} />
            <Route exact path="/orderPlacedPage" render={props => <OrderPlacedPage {...props} />} />
            <Route exact path="/offersPage" render={props => <OffersPage {...props} />} />
            <Route exact path="/orderHistoryPage" render={props => <OrderHistoryPage {...props} />} />
            <Route exact path="/profilePage" render={props => <ProfilePage {...props} />} />
            <Route exact path="/adminPage" render={props => <AdminPage {...props} />} />
            <Route path="/error404" render={props => <NotFoundPage {...props} />} />
            <Route component={NotFoundPage} />
          </Switch>
        }
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
