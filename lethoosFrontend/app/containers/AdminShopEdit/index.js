/**
 *
 * AdminShopEdit
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
import makeSelectAdminShopEdit from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Header from '../../components/Header/Loadable'
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { errorHandler } from "../../utils/customUtils";
import MessageModal from '../../components/MessageModal';

/* eslint-disable react/prefer-stateless-function */
export class AdminShopEdit extends React.PureComponent {

  state = {
    isLoader: true,
    shopDetails: {
      name: "",
      address: "",
      time: "",
      details: []
    },
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getShopDetails()
    }
  }

  getShopDetails = () => {
    let url = window.API_URL + `/shop/${this.props.match.params.id}`;
    let orderHistory = JSON.parse(sessionStorage.getItem("orderHistory")) ? JSON.parse(sessionStorage.getItem("orderHistory")) : cloneDeep(this.state.orderHistory);
    axios.get(url)
      .then((res) => {
        let shopDetails = res.data;
        this.setState({ shopDetails, isLoader: false });
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

    var shopDetails = cloneDeep(this.state.shopDetails)
    let value = event.target.value
    let id = event.target.id

    shopDetails[id] = value

    this.setState({
      shopDetails
    })
  }

  toggleChangeHandler = event => {
    var shopDetails = cloneDeep(this.state.shopDetails)
    let id = event.target.id
    shopDetails[id] = event.target.checked

    this.setState({
      shopDetails
    }, () => this.shopDetailsUpdateApiHandler())
  }

  shopDetailsUpdateApiHandler = () => {
    var shopDetails = cloneDeep(this.state.shopDetails)
    let url = window.API_URL + `/shop/${this.props.match.params.id}`;
    axios.patch(url, shopDetails)
      .then((res) => {
        this.setState({
          isLoader: false,
          message: "Shop Updated Successfully",
          isMessageModal: true,
          type: "success"
        }, () => this.modalCloseHandler())
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

  modalCloseHandler = () => {
    setTimeout(() => {
      this.setState({
        isMessageModal: false
      })
    }, 1000);
  }

  submitHandler = event => {
    event.preventDefault()
    this.shopDetailsUpdateApiHandler()
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>AdminShopEdit</title>
          <meta name="description" content="Description of AdminShopEdit" />
        </Helmet>
        <Header />
        <p className="offers-heading">{this.state.shopDetails.name}</p>
        <div className="admin-shop-outer">
          <div className="admin-shop-edit">
            {this.state.isLoader ?
              <div className="lds-dual-ring"></div>
              :
              <React.Fragment>
                <div className="row">
                  <div className="col-md-6">
                    <form onSubmit={this.submitHandler}>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Name</label>
                        <input value={this.state.shopDetails.name} id="name" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Time</label>
                        <input value={this.state.shopDetails.time} id="time" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Delivery Time</label>
                        <input value={this.state.shopDetails.deliveryTime} id="deliveryTime" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Address</label>
                        <input value={this.state.shopDetails.address} id="deliveryTime" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Description</label>
                        <textarea cols="25" rows="3" value={this.state.shopDetails.description} id="description" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <button type="submit" className="btn btn-warning login-button place-order-button">Update</button>
                    </form>
                  </div>
                  <div className="col-md-6">
                    <img className="admin-shop-image img-responsive" src={this.state.shopDetails.image} />
                    <div className="col-md-6">
                      <div className="admin-shop-status-text">Shop Status (Open/Close)</div>
                      <label className="switch">
                        <input checked={this.state.shopDetails.status} id="status" onChange={this.toggleChangeHandler} type="checkbox" />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    <div className="col-md-6">
                      <div className="admin-shop-status-text">Shop Active or InActive</div>
                      <label className="switch">
                        <input checked={this.state.shopDetails.isActive} id="isActive" onChange={this.toggleChangeHandler} type="checkbox" />
                        <span className="slider round"></span>
                      </label>
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

AdminShopEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  adminShopEdit: makeSelectAdminShopEdit(),
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

const withReducer = injectReducer({ key: 'adminShopEdit', reducer });
const withSaga = injectSaga({ key: 'adminShopEdit', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AdminShopEdit);
