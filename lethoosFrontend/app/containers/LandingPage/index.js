/**
 *
 * LandingPage
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
import makeSelectLandingPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import axios from 'axios';
import MessageModal from '../../components/MessageModal/Loadable'
import { capitalizeFirstLetter } from '../../utils/customUtils'

/* eslint-disable react/prefer-stateless-function */
export class LandingPage extends React.PureComponent {

  state = {
    isOpenClassName: 'modal display-none container',
    shops: [],
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

  componentDidMount() {
    this.getShops()
  }


  getShops = () => {
    let url = window.API_URL + "/shop";
    axios.get(url)
      .then((res) => {
        const shops = res.data;
        this.setState({ shops });
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });
  };

  modalTime = () => {
    this.setState({
      isOpenClassName: 'modal display-none container',
      isLoader: false
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Shops - Select Your Shop</title>
          <meta name="description" content="Description of LandingPage" />
        </Helmet>
        <div className="header sticky-top">
          <img className="logo" src={require('../../assets/images/logo.png')} />
          <p className="logo-text">Le Thoos</p>
          <span className="nav-items">
          {/* <span className="nav-mr" onClick={() => this.props.history.push('/landingPage')}><i className="fa fa-home" aria-hidden="true"></i> Shops</span> */}
            <span className="nav-mr" onClick={() => this.props.history.push('/offersPage')}><i className="fa fa-tags" aria-hidden="true"></i> Offers</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/orderHistoryPage')}><i className="fa fa-history" aria-hidden="true"></i> Order History</span>
            <span className="nav-mr"><i className="fa fa-user" aria-hidden="true"></i> {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/checkoutPage')}><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart</span>
            <span className="nav-mr" onClick={() => { sessionStorage.clear(); this.props.history.push('/login') }}><i className="fa fa-power-off" aria-hidden="true"></i> Logout</span>
          </span>
        </div>
        <div className="content-padding">
          <span className="count-text">{this.state.shops.length} {this.state.shops.length > 1 ? "Shops" : "Shop"}</span>
          <hr></hr>
          <div className="row pd-39">
            {
              this.state.shops.map((val, index) => {
                return <div key={index} onClick={() => this.props.history.push(`/shopDetails/${val._id}`)} className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="box">
                    <img className="shop-image img-responsive" src={val.image} />
                    <p className="shop-heading">{val.name}</p>
                    <p className="shop-time">{val.time}</p>
                    <p className="shop-address">{val.address}</p>
                  </div>
                </div>
              })
            }
          </div>
        </div>
        <MessageModal
          showHideClassName={this.state.isOpenClassName}
          modalType={this.state.type}
          message={this.state.message}
          onClose={this.modalCloseHandler}
        />

      </div>
    );
  }
}

LandingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  landingPage: makeSelectLandingPage(),
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

const withReducer = injectReducer({ key: 'landingPage', reducer });
const withSaga = injectSaga({ key: 'landingPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LandingPage);
