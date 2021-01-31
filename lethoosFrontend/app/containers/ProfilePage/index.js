/**
 *
 * ProfilePage
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
import makeSelectProfilePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { capitalizeFirstLetter } from '../../utils/customUtils'
import axios from 'axios';
import { cloneDeep } from 'lodash';

/* eslint-disable react/prefer-stateless-function */
export class ProfilePage extends React.PureComponent {

  state = {
    customerDetails: {},
    payload: {
      name: "",
      address: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      area: ""
    },
    isLoader: false
  }

  componentWillMount() {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;

    let payload = cloneDeep(this.state.payload)

    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }

    payload = {
      name: customerDetails.name,
      address: customerDetails.address,
      mobileNumber: customerDetails.mobileNumber,
      alternateMobileNumber: customerDetails.alternateMobileNumber,
      area: customerDetails.area
    }

    this.setState({
      customerDetails,
      payload
    })
  }

  inputChangeHandler = event => {
    let payload = cloneDeep(this.state.payload)
    payload[event.target.id] = event.target.value
    this.setState({
      payload,
    })
  }

  updateProfileHandler = (event) => {
    event.preventDefault();
    let payload = cloneDeep(this.state.payload)
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;

    customerDetails.name = payload.name
    customerDetails.address = payload.address
    customerDetails.mobileNumber = payload.mobileNumber
    customerDetails.alternateMobileNumber = payload.alternateMobileNumber
    customerDetails.area = payload.area

    sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails))

    this.setState({
      customerDetails,
      payload: customerDetails,
      isLoader: true
    }, () => this.updateProfileHandlerApi())

  }


  updateProfileHandlerApi = () => {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    let payload = cloneDeep(this.state.payload)

    let url = window.API_URL + `/customerLogin/${customerDetails._id}`;
    axios.patch(url, payload)
      .then((res) => {
        this.setState({
          isLoader: false
        })
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>ProfilePage</title>
          <meta name="description" content="Description of ProfilePage" />
        </Helmet>

        <div className="header sticky-top">
          <img className="logo" src={require('../../assets/images/logo.png')} />
          <p className="logo-text">Le Thoos</p>
          <span className="nav-items">
            <span className="nav-mr" onClick={() => this.props.history.push('/landingPage')}><i className="fa fa-home" aria-hidden="true"></i> Shops</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/offersPage')}><i className="fa fa-tags" aria-hidden="true"></i> Offers</span>
            <span className="nav-mr" onClick={() => this.props.history.push('/orderHistoryPage')}><i className="fa fa-history" aria-hidden="true"></i> Order History</span>
            {/* <span className="nav-mr" onClick={() => this.props.history.push('/profilePage')}><i className="fa fa-user" aria-hidden="true"></i> {this.state.customerDetails.name && capitalizeFirstLetter(this.state.customerDetails.name)}</span> */}
            <span className="nav-mr" onClick={() => this.props.history.push('/checkoutPage')}><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart</span>
            <span className="nav-mr" onClick={() => { sessionStorage.clear(); this.props.history.push('/login') }}><i className="fa fa-power-off" aria-hidden="true"></i> Logout</span>
          </span>
        </div>
        <p className="offers-heading">My Profile</p>
        <div className="profile-page-outer">
          {this.state.isLoader ?
            <div className="lds-dual-ring"></div> :
            <form onSubmit={this.updateProfileHandler}>
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="form-group mr-b-30">
                    <label className="box-label" htmlFor="inputlg">Name</label>
                    <input value={this.state.payload.name} id="name" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="form-group mr-b-30">
                    <label className="box-label" htmlFor="inputlg">Select Area</label>
                    <select className="profile-page-area-box" onChange={this.inputChangeHandler} value={this.state.payload.area} id="area" required>
                      <option value="Other20">Other</option>
                      <option value="kosi10">kosi</option>
                      <option value="jindal20">Jindal</option>
                      <option value="narsiVillage20">Narsi Village</option>
                      <option value="gopalBagh20">Gopal Bagh</option>
                      <option value="kamlaNagar20">Kamla Nagar</option>
                      <option value="bathenGate20">Bathen Gate</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">

                <div className="col-md-6 col-12">
                  <div className="form-group mr-b-30">
                    <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                    <input value={JSON.parse(sessionStorage.getItem('customerDetails')).mobileNumber} id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required readOnly />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="form-group mr-b-30">
                    <label className="box-label" htmlFor="inputlg">Alternate Mobile Number</label>
                    <input value={this.state.payload.alternateMobileNumber} id="alternateMobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                  </div>
                </div>

              </div>

              <div className="form-group mr-b-30">
                <label className="box-label" htmlFor="inputlg">Address</label>
                <textarea rows="3" cols="50" value={this.state.payload.address} id="address" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
              </div>

              <div className="text-right">
                <button type="submit" className="btn btn-warning profile-page-btn">Update</button>
              </div>
            </form>
          }
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profilePage: makeSelectProfilePage(),
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

const withReducer = injectReducer({ key: 'profilePage', reducer });
const withSaga = injectSaga({ key: 'profilePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ProfilePage);
