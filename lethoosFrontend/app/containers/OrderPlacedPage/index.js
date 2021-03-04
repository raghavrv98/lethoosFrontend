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
import Header from '../../components/Header/Loadable'
import messages from './messages';
import { capitalizeFirstLetter } from '../../utils/customUtils'

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

        <Header />

        <div className="order-placed-outer">
          <h1>{this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}, Your Order has been successfully placed.</h1>
          <div className="order-placed-box">
            <img className="order-placed-image" src={require('../../assets/images/orderPlaced.png')} />
            <p className="order-placed-text">Preparing your Order.</p>
            <p className="order-placed-text">Your Order will be prepared and delivered in a Maximum of 40 min.</p>
            <p className="order-placed-text">Delivered Agent Name : Pawan Singh</p>
            <p className="order-placed-text">Delivered Agent Number : 8439395179</p>
            <div className="form-group">
              <button type="button" onClick={() => this.props.history.push('/orderHistoryPage')} className="btn btn-warning login-button order-placed-btn">Order History</button>
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
