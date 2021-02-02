/**
 *
 * OffersPage
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
import makeSelectOffersPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import moment from 'moment';
import Header from '../../components/Header/Loadable'

/* eslint-disable react/prefer-stateless-function */
export class OffersPage extends React.PureComponent {

  state = {
    customerDetails: {},
    couponIdCopy: ""
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

  copyCoupon = couponId => {
    let tempElement = document.createElement("textarea");
    tempElement.value = couponId;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
    this.setState({
      couponIdCopy: 'Copied!'
    })
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>OffersPage</title>
          <meta name="description" content="Description of OffersPage" />
        </Helmet>

        <Header />

        <p className="offers-heading">Offers</p>

        <div className="offers-page-outer row">
          {this.state.customerDetails.coupon.length > 0 ?
            this.state.customerDetails.coupon.map((val, index) =>
              <div key={index} className="col-md-3">
                {(val.validity < new Date().getTime() || val.attempt == 0) && < img className="offers-expired-img" src={require('../../assets/images/offerExpired.png')} />}
                <div onClick={() => this.copyCoupon(val.name)} className="offers-box">
                  <p className="offers-box-heading text-center">Tap To Copy</p>
                  <p className="offers-box-text mr-b-10">{val.description}</p>
                  <div className="offers-box-text"><span className="color-gray">Offered By</span> <span className="float-right">{val.offeredBy}</span></div>
                  <div className="offers-box-text"><span className="color-gray">Valid Upto</span> <span className="float-right">{moment(val.validity).format("DD MMM HH:mm")}</span></div>
                  <div className="offers-box-text"><span className="color-gray">Attempt</span>  <span className="float-right">{val.redeemAttempt}</span></div>
                  <div className="offers-copy-btn-outer"><div className="offers-copy-btn"><span className="offers-text">{val.name}</span></div></div>
                  <p className="offers-box-copied-text">{this.state.couponIdCopy}</p>
                </div>
              </div>
            )
            :
            <React.Fragment>
              <p className="offers-not-found-text1">No Offers</p>
              <p className="offers-not-found-text2">Come Back Soon</p>
              <img className="offers-not-found" src={require('../../assets/images/notFoundOffers.png')} />
            </React.Fragment>
          }

        </div>

      </div >
    );
  }
}

OffersPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  offersPage: makeSelectOffersPage(),
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

const withReducer = injectReducer({ key: 'offersPage', reducer });
const withSaga = injectSaga({ key: 'offersPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(OffersPage);
