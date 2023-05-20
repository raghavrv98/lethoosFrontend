/**
 *
 * NotFoundPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Header from '../../components/Header/Loadable'
/* eslint-disable react/prefer-stateless-function */
class NotFoundPage extends React.PureComponent {

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
        <Header />
        <div className="offers-page-outer">
          <img className="offers-not-found" src={require('../../assets/images/notFoundPage.png')} />
        </div>
      </div>
    );
  }
}

NotFoundPage.propTypes = {};

export default NotFoundPage;
