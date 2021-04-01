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
import Header from '../../components/Header/Loadable'
import { errorHandler } from "../../utils/customUtils";
import MessageModal from '../../components/MessageModal';
import NotifyModalBox from '../../components/NotifyModalBox';

/* eslint-disable react/prefer-stateless-function */
export class LandingPage extends React.PureComponent {

  state = {
    shops: [],
    isLoader: true,
    isNotifyBoxOpen: false
  }

  componentDidMount() {
    this.getShops()
    this.getcustomerDetails()
    setTimeout(() => {
      this.setState({
        isNotifyBoxOpen: true
      })
    }, 500);
  }

  getShops = () => {
    let url = window.API_URL + "/shop";
    axios.get(url)
      .then((res) => {
        const shops = res.data;
        shops.sort((a, b) => (a.priority - b.priority))

        var shopsCount = shops.filter(val => val.isActive).length
        this.setState({ shops, isLoader: false, shopsCount });
      })
      .catch((error) => {
        this.setState({
          isLoader: false,
          message: "Some Error Occured",
          isMessageModal: true,
          type: "failure"
        })
      });
  }

  getcustomerDetails = () => {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    let url = window.API_URL + `/customerLogin/${customerDetails._id}`;
    axios.get(url)
      .then((res) => {
        let customerDetails = res.data
        customerDetails.coupon.map(val => val.copied = undefined)
        sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails))
        this.setState({
          customerDetails,
          isLoader: true
        })
      })
      .catch((error) => {
        this.setState({
          isLoader: false,
          message: "Some Error Occured",
          isMessageModal: true,
          type: "failure"
        })
      });
  }

  notifyModalCloseHandler = () => {
    this.setState({
      isMessageModal: false,
      isNotifyBoxOpen: false
    })
  }

  modalCloseHandler = () => {
    setTimeout(() => {
      this.setState({
        isMessageModal: false
      })
    }, 1000);
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Shops - Select Your Shop</title>
          <meta name="description" content="Description of LandingPage" />
        </Helmet>

        <Header />

        <p className="offers-heading">Shops</p>
        <div className="content-padding">
          {this.state.isLoader ?
            <div className="lds-dual-ring"></div>
            :
            <React.Fragment>
              <span className="count-text">{this.state.shops.length > 0 ? <React.Fragment> {this.state.shopsCount} {this.state.shopsCount > 1 ? "Shops" : "Shop"} <hr /></React.Fragment> : ""}</span>
              {this.state.isNotifyBoxOpen && this.state.customerDetails && this.state.customerDetails.address.length == 0 && < NotifyModalBox heading={"Update Profile"} onClose={this.notifyModalCloseHandler} />}
              <div className="row pd-39">
                {this.state.shops.length > 0 ?
                  this.state.shops.map((val, index) => {
                    if (val.isActive) {
                      return <div key={index} onClick={() => this.props.history.push(`/shopDetails/${val._id}`)} className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                        <div className={val.status ? "box" : "box shop-closed-color"}>
                          <img className="shop-image img-responsive" src={val.image} />
                          {!val.status && <div className="shop-closed-tag">Closed</div>}
                          <p className="shop-heading">{val.name}</p>
                          <p className="shop-time"><span className="shop-time-heading">Timing :</span> {val.time}</p>
                          <p className="shop-time"><span className="shop-time-heading">Delivery Time :</span> {val.deliveryTime}</p>
                          <p className="shop-address"><span className="shop-time-heading">Address :</span> {val.address}</p>
                          <p className="shop-address"><span className="shop-time-heading">Description :</span> {val.description}</p>
                        </div>
                      </div>
                    }
                  })
                  :
                  <div className="no-shops-found">
                    {console.log("jhi")}
                    <p className="no-shops-found-heading">No Shops Available</p>
                    <img className="no-shops-found-image" src={require('../../assets/images/noShopsFound.jpg')} />
                    <img className="no-shops-found-image-glass" src={require('../../assets/images/glassIcon.png')} />
                  </div>
                }
              </div>
            </React.Fragment>
          }
        </div>
        {this.state.isMessageModal && <MessageModal
          modalType={this.state.type}
          message={this.state.message}
          onClose={this.modalCloseHandler}
        />}
      </div >
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
