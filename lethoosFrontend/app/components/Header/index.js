/**
 *
 * Header
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import history from "./../../utils/history";
import { capitalizeFirstLetter } from '../../utils/customUtils'

/* eslint-disable react/prefer-stateless-function */
class Header extends React.PureComponent {

  state = {
    customerDetails: {},
    sideNavStatus: false
  }

  componentWillMount() {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      history.push('/login')
    }
    this.setState({
      customerDetails
    })
  }

  openCloseNav = () => {
    let sideNavStatus = this.state.sideNavStatus
    this.setState({
      sideNavStatus: !sideNavStatus
    })
  }

  closeNav = () => {
    this.setState({
      sideNavStatus: false
    })
  }

  render() {
    return (
      <div>

        <span className="nav-desktop-view">
          <div className="header sticky-top">
            <img className="logo" src={require('../../assets/images/logo.png')} />
            <p className="logo-text">Le Thoos</p>
            <span className="nav-items">
              {this.state.customerDetails.accountType === "admin" && <span className="nav-mr" onClick={() => history.push('/adminPage')}><i className="fa fa-cogs" aria-hidden="true"></i> Admin</span>}
              {this.state.customerDetails.accountType === "admin" && <span className="nav-mr" onClick={() => history.push('/orderDetails')}><i className="fa fa-info-circle" aria-hidden="true"></i> Order Details</span>}
              <span className="nav-mr" onClick={() => history.push('/landingPage')}><i className="fa fa-home" aria-hidden="true"></i> Shops</span>
              <span className="nav-mr" onClick={() => history.push('/offersPage')}><i className="fa fa-tags" aria-hidden="true"></i> Offers</span>
              <span className="nav-mr" onClick={() => history.push('/orderHistoryPage')}><i className="fa fa-history" aria-hidden="true"></i> Order History</span>
              <span className="nav-mr" onClick={() => history.push('/profilePage')}><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Profile</span>
              <span className="nav-mr" onClick={() => history.push('/checkoutPage')}><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart</span>
              <span className="nav-mr" ><i className="fa fa-user" aria-hidden="true"></i> {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</span>
              <span className="nav-mr" onClick={() => { sessionStorage.clear(); history.push('/login') }}><i className="fa fa-power-off" aria-hidden="true"></i> Logout</span>
            </span>
          </div>
        </span>

        <span className="nav-mob-view">
          <div id="mySidenav" className={this.state.sideNavStatus ? "openNav sidenav" : "closeNav sidenav"}>
            <a className="closebtn" onClick={() => this.closeNav()}>&times;</a>
            <div className="mr-b-30">
              <img className="logo-mob" src={require('../../assets/images/logo.png')} />
              <p className="logo-text-mob">Le Thoos</p>
            </div>
            <p className="mob-nav-text">Hi, {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</p>
            {this.state.customerDetails.accountType === "admin" && <p className="sidenav-heading" onClick={() => history.push('/adminPage')}>Admin</p>}
            {this.state.customerDetails.accountType === "admin" && <p className="sidenav-heading" onClick={() => history.push('/orderDetails')}>Order Details</p>}
            <p className="sidenav-heading" onClick={() => history.push('/profilePage')} >Profile</p>
            <p className="sidenav-heading" onClick={() => history.push('/orderHistoryPage')}>Order History</p>
            <p className="sidenav-heading" onClick={() => history.push('/landingPage')}>Shops</p>
            <p className="sidenav-heading" onClick={() => history.push('/offersPage')}>Offers</p>
            <p className="sidenav-heading" onClick={() => history.push('/checkoutPage')}>Cart</p>
            <p className="sidenav-heading" onClick={() => { sessionStorage.clear(); history.push('/login') }}>Logout</p>
          </div>
          <div id="main">
            <img className="logo" src={require('../../assets/images/logo.png')} />
            <p className="logo-text">Le Thoos</p>
            <span onClick={() => this.openCloseNav()}><span className="landing-page-mob-nav-icon"><i className="fa fa-bars" aria-hidden="true"></i></span></span>
          </div>
        </span>

      </div>
    );
  }
}

Header.propTypes = {};

export default Header;
