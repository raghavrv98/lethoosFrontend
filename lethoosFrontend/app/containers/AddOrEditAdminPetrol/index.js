/**
 *
 * AddOrEditAdminPetrol
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
import makeSelectAddOrEditAdminPetrol from './selectors';
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
export class AddOrEditAdminPetrol extends React.PureComponent {

  state = {
    isLoader: false,
    petrolDetails: {
      petrolPrice: 89.02
    },
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.setState({
        isLoader: true
      }, () => this.getPetrolDetails())
    }
  }

  getPetrolDetails = () => {
    let url = window.API_URL + `/petrolDetailsById/${this.props.match.params.id}`;
    axios.get(url)
      .then((res) => {
        let petrolDetails = res.data;
        this.setState({ petrolDetails, isLoader: false });
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

    var petrolDetails = cloneDeep(this.state.petrolDetails)
    let value = event.target.value
    let id = event.target.id

    petrolDetails[id] = value

    this.setState({
      petrolDetails
    })
  }

  petrolDetailsUpdateApiHandler = () => {
    var petrolDetails = cloneDeep(this.state.petrolDetails)
    let url = window.API_URL + `/petrolDetailsUpdate/${this.props.match.params.id}`;
    axios.patch(url, petrolDetails)
      .then((res) => {
        this.setState({
          isLoader: false,
          message: "Petrol slip updated successfully",
          isMessageModal: true,
          type: "success"
        }, () => { this.modalCloseHandler(); this.props.history.push('/petrolDetails') })
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

  petrolDetailsCreateApiHandler = () => {
    var petrolDetails = cloneDeep(this.state.petrolDetails)
    let url = window.API_URL + `/petrolDetailsCreate`;
    axios.post(url, petrolDetails)
      .then((res) => {
        this.setState({
          isLoader: false,
          message: "Petrol slip created successfully",
          isMessageModal: true,
          type: "success"
        }, () => { this.modalCloseHandler(); this.props.history.push('/petrolDetails') })
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
    }, () => { this.props.match.params.id ? this.petrolDetailsUpdateApiHandler() : this.petrolDetailsCreateApiHandler() })
  }

  checkboxHandler = event => {
    var petrolDetails = cloneDeep(this.state.petrolDetails)
    petrolDetails[event.target.id] = event.target.value
    this.setState({
      petrolDetails
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>AddOrEditAdminPetrol</title>
          <meta
            name="description"
            content="Description of AddOrEditAdminPetrol"
          />
        </Helmet>

        <Header />
        <div className="admin-shop-outer">
          <p className="offers-heading">{this.props.match.params.id ? "Update" : "Create"} Petrol Slip</p>
          <div className="admin-shop-edit">
            {this.state.isLoader ?
              <div className="lds-dual-ring"></div>
              :
              <div className="row">
                <form onSubmit={this.submitHandler}>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Amount</label>
                      <input value={this.state.petrolDetails.amount} id="amount" min='0' onChange={this.inputChangeHandler} className="form-control input-lg" type="number" step="0.01" required />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Previous Km</label>
                      <input value={this.state.petrolDetails.previousKm} id="previousKm" min='0' onChange={this.inputChangeHandler} className="form-control input-lg" type="number" required />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Current Km</label>
                      <input value={this.state.petrolDetails.currentKm} id="currentKm" min='0' onChange={this.inputChangeHandler} className="form-control input-lg" type="number" required />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Petrol Price</label>
                      <input value={this.state.petrolDetails.petrolPrice} id="petrolPrice" min='0' onChange={this.inputChangeHandler} className="form-control input-lg" type="number" step="0.01" required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Petrol Pump Place</label>
                      <div>
                        <input type="radio" className="radio-btn-size" value="byepass" checked={this.state.petrolDetails.petrolPumpPlace === 'byepass'} required id="petrolPumpPlace" name="accountType" onChange={this.checkboxHandler} /><span className="account-type-text">ByePass</span>
                        <input type="radio" className="radio-btn-size" value="bathengate" checked={this.state.petrolDetails.petrolPumpPlace === 'bathengate'} required id="petrolPumpPlace" name="accountType" onChange={this.checkboxHandler} /><span className="account-type-text">Bathengate</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Bike Name</label>
                      <div>
                        <input type="radio" className="radio-btn-size" value="cdDelux" checked={this.state.petrolDetails.bikeName === 'cdDelux'} required id="bikeName" name="bikeName" onChange={this.checkboxHandler} /><span className="account-type-text">CD Delux</span>
                        <input type="radio" className="radio-btn-size" value="ct100" checked={this.state.petrolDetails.bikeName === 'bathengate'} required id="bikeName" name="bikeName" onChange={this.checkboxHandler} /><span className="account-type-text">CT 100</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Bike Number</label>
                      <div>
                        <input type="radio" className="radio-btn-size" value="HR123" checked={this.state.petrolDetails.bikeNumber === 'HR123'} required id="bikeNumber" name="bikeNumber" onChange={this.checkboxHandler} /><span className="account-type-text">HR123</span>
                        <input type="radio" className="radio-btn-size" value="UP123" checked={this.state.petrolDetails.bikeNumber === 'UP123'} required id="bikeNumber" name="bikeNumber" onChange={this.checkboxHandler} /><span className="account-type-text">UP123</span>
                      </div>
                    </div>
                    <div className="form-group"><button type="submit" className="btn btn-warning profile-page-btn">{this.props.match.params.id ? "Update" : "Add"}</button></div>
                  </div>
                </form>
              </div>
            }
          </div>
        </div>
        {
          this.state.isMessageModal && <MessageModal
            modalType={this.state.type}
            message={this.state.message}
            onClose={this.modalCloseHandler}
          />
        }
      </div >
    );
  }
}

AddOrEditAdminPetrol.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addOrEditAdminPetrol: makeSelectAddOrEditAdminPetrol(),
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

const withReducer = injectReducer({ key: 'addOrEditAdminPetrol', reducer });
const withSaga = injectSaga({ key: 'addOrEditAdminPetrol', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AddOrEditAdminPetrol);
