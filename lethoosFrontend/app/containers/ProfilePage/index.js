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
import Header from '../../components/Header/Loadable'
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { errorHandler } from "../../utils/customUtils";
import MessageModal from '../../components/MessageModal';

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

  modalCloseHandler = () => {
    setTimeout(() => {
      this.setState({
        isMessageModal: false
      })
    }, 1000);
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
          isLoader: false,
          message: "Profile Updated Successfully",
          isMessageModal: true,
          type: "success"
        }, () => this.modalCloseHandler())
      })
      .catch((error) => {
        // let message = errorHandler(error);
        this.setState({
          isLoader: false,
          message: "Some Error Occured",
          isMessageModal: true,
          type: "failure"
        })
      });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>ProfilePage</title>
          <meta name="description" content="Description of ProfilePage" />
        </Helmet>

        <Header />

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
                    <input value={JSON.parse(sessionStorage.getItem('customerDetails')).mobileNumber} pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required readOnly />
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="form-group mr-b-30">
                    <label className="box-label" htmlFor="inputlg">Mobile Number for Call</label>
                    <input value={this.state.payload.alternateMobileNumber} pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" id="alternateMobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required />
                  </div>
                </div>

              </div>

              <div className="form-group mr-b-30">
                <label className="box-label" htmlFor="inputlg">Address</label>
                <textarea rows="3" cols="50" value={this.state.payload.address} pattern="^[\.a-zA-Z0-9,!? ]*$" title="Use only Numbers, Alphabets, spaces and ," id="address" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
              </div>

              <div className="text-right">
                <button type="submit" className="btn btn-warning profile-page-btn">Update</button>
              </div>
            </form>
          }
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
