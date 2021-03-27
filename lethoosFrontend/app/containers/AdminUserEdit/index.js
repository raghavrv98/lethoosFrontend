/**
 *
 * AdminUserEdit
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
import makeSelectAdminUserEdit from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header/Loadable'
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { errorHandler } from "../../utils/customUtils";
import MessageModal from '../../components/MessageModal';
import moment from 'moment';

/* eslint-disable react/prefer-stateless-function */
export class AdminUserEdit extends React.PureComponent {

  state = {
    isLoader: true,
    userDetails: {
    },
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getUserDetails()
    }
  }

  getUserDetails = () => {
    let url = window.API_URL + `/customerLogin/${this.props.match.params.id}`;
    axios.get(url)
      .then((res) => {
        let userDetails = res.data;
        this.setState({ userDetails, isLoader: false });
      })
      .catch((error) => {
        this.setState({
          isLoader: false,
          message: "Some Error Occured",
          isMessageModal: true,
          type: "failure"
        })
      });
  };

  inputChangeHandler = event => {
    event.preventDefault();

    var userDetails = cloneDeep(this.state.userDetails)
    let value = event.target.value
    let id = event.target.id

    userDetails[id] = value

    this.setState({
      userDetails
    })
  }

  toggleChangeHandler = event => {
    var userDetails = cloneDeep(this.state.userDetails)
    let id = event.target.id
    userDetails[id] = event.target.checked

    console.log('userDetails: ', userDetails);
    this.setState({
      userDetails
    })
  }

  userDetailsUpdateApiHandler = () => {
    var userDetails = cloneDeep(this.state.userDetails)
    console.log('userDetails:---- ', userDetails);
    let url = window.API_URL + `/customerLogin/${this.props.match.params.id}`;
    axios.patch(url, userDetails)
      .then((res) => {
        this.setState({
          isLoader: false,
          message: "User updated successfully",
          isMessageModal: true,
          type: "success"
        }, () => this.modalCloseHandler(), this.getUserDetails())
      })
      .catch((error) => {
        this.setState({
          isLoader: false,
          message: "Some error occured",
          isMessageModal: true,
          type: "failure"
        })
      });
  }

  modalCloseHandler = () => {
    setTimeout(() => {
      this.setState({
        isMessageModal: false
      })
    }, 1000);
  }

  submitHandler = event => {
    event.preventDefault()
    this.setState({
      isLoader: true
    }, () => this.userDetailsUpdateApiHandler())
  }

  accountTypeChangeHandler = event => {
    var userDetails = cloneDeep(this.state.userDetails)
    userDetails[event.target.id] = event.target.value
    this.setState({
      userDetails
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>AdminUserEdit</title>
          <meta name="description" content="Description of AdminUserEdit" />
        </Helmet>
        <Header />
        <div className="admin-shop-outer">
          <div className="admin-shop-edit">
            {this.state.isLoader ?
              <div className="lds-dual-ring"></div>
              :
              <React.Fragment>
                <div className="row">
                  <form onSubmit={this.submitHandler}>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Name</label>
                        <input value={this.state.userDetails.name} id="name" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                        <input value={this.state.userDetails.mobileNumber} id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Alternate Mobile Number</label>
                        <input value={this.state.userDetails.alternateMobileNumber} id="alternateMobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Address</label>
                        <input value={this.state.userDetails.address} id="address" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">password</label>
                        <input value={this.state.userDetails.password} id="password" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Created At</label>
                        <input value={moment(this.state.userDetails.date).format("DD MMM YYYY HH:mm")} id="date" disabled onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">AccountType</label>
                        <div>
                          <input type="radio" className="radio-btn" value="admin" checked={this.state.userDetails.accountType === 'admin'} required id="accountType" name="accountType" onChange={this.accountTypeChangeHandler} /><span className="account-type-text">Admin</span>
                          <input type="radio" className="radio-btn" value="deliveryRider" checked={this.state.userDetails.accountType === 'deliveryRider'} required id="accountType" name="accountType" onChange={this.accountTypeChangeHandler} /><span className="account-type-text">Delivery Rider</span>
                          <input type="radio" className="radio-btn" value="user" checked={this.state.userDetails.accountType === 'user'} required id="accountType" name="accountType" onChange={this.accountTypeChangeHandler} /><span className="account-type-text">User</span>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Active User</label>
                        <div>
                          <label className="switch">
                            <input checked={this.state.userDetails.status} id="status" onChange={this.toggleChangeHandler} type="checkbox" />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-warning profile-page-btn admin-edit-user-btn">Update</button>
                  </form>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <p className="box-label">Offers</p>
                    <div className="admin-box-outer">
                      {this.state.userDetails.coupon.length > 0 ?
                        this.state.userDetails.coupon.map((val, index) => {
                          return <div key={index} className="col-md-6">
                            {(val.validity < new Date().getTime() || parseInt(val.redeemAttempt) <= 0) && < img className="offers-expired-img" src={require('../../assets/images/offerExpired.png')} />}
                            <div onClick={() => !(val.validity < new Date().getTime() || parseInt(val.redeemAttempt) <= 0) && this.copyCoupon(val.name, index)} className="offers-box">
                              <p className="offers-box-heading text-center">Tap To Copy</p>
                              <p className="offers-box-text mr-b-10">{val.description}</p>
                              <div className="offers-box-text"><span className="color-gray">Offered By</span> <span className="float-right">{val.offeredBy}</span></div>
                              <div className="offers-box-text"><span className="color-gray">Valid Upto</span> <span className="float-right">{moment(val.validity).format("DD MMM HH:mm")}</span></div>
                              <div className="offers-box-text"><span className="color-gray">Attempt</span>  <span className="float-right">{val.redeemAttempt}</span></div>
                              <div className="offers-copy-btn-outer"><div className="offers-copy-btn"><span className="offers-text">{val.name}</span></div></div>
                              <p className="offers-box-copied-text">{val.copied}</p>
                            </div>
                          </div>
                        }
                        )
                        :
                        <React.Fragment>
                          <p className="offers-not-found-text1">No Offers</p>
                          <p className="offers-not-found-text2">Come Back Soon</p>
                          <img className="offers-not-found" src={require('../../assets/images/notFoundOffers.png')} />
                        </React.Fragment>
                      }
                    </div>
                  </div>
                  <div className="col-md-6">
                    <p className="box-label">Order History</p>
                    <div className="admin-box-outer">
                      {this.state.userDetails.orderHistory.length > 0 ?
                        this.state.userDetails.orderHistory.map((val, index) =>
                          <div key={index} className="col-md-6 no-padding">
                            {val.isOrderCancel && < img className="order-cancel-img" src={require('../../assets/images/cancel.png')} />}
                            <div className="order-history-box">
                              <div className="row">
                                <div className="col-md-6">
                                  <img className="order-history-box-image" src={val.shopImage} />
                                </div>
                                <div className="col-md-6">
                                  <p className="order-history-box-heading">{val.shopName}</p>
                                  <p className="order-history-box-text-heading">{val.shopAddress}</p>
                                </div>
                              </div>
                              <hr />
                              <p className="mr-b-10"><span className="order-history-box-text-heading">Order Number :</span><span className="order-history-box-text">{val.orderNumber}</span></p>
                              <p className="mr-b-10"><span className="order-history-box-text-heading">Order Date :</span><span className="order-history-box-text">{moment(val.orderDate).format("DD MMM YYYY HH:mm")}</span></p>
                              <div className="text-center"><button type="button" onClick={() => this.detailsModalHandler(val)} className="order-history-box-btn"><span className="order-history-box-btn-text">View Details</span></button></div>
                            </div>
                          </div>
                        ) :
                        <React.Fragment>
                          <div className="no-content-box">
                            <p className="no-shops-found-heading m-0">No Orders Available</p>
                            <img className="no-shops-found-image-order-history" src={require('../../assets/images/noDetailsFound.png')} />
                            <img className="no-shops-found-image-glass-order-history" src={require('../../assets/images/glassIcon.png')} />
                          </div>
                        </React.Fragment>
                      }
                    </div>
                  </div>
                </div>
              </React.Fragment>
            }
          </div>
        </div>
        {this.state.isMessageModal && <MessageModal
          modalType={this.state.type}
          message={this.state.message}
          onClose={this.modalCloseHandler}
        />}
      </div>
    );
  }
}

AdminUserEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  adminUserEdit: makeSelectAdminUserEdit(),
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

const withReducer = injectReducer({ key: 'adminUserEdit', reducer });
const withSaga = injectSaga({ key: 'adminUserEdit', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AdminUserEdit);
