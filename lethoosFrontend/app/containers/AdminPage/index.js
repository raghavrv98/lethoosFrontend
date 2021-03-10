/**
 *
 * AdminPage
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
import makeSelectAdminPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import MessageModal from '../../components/MessageModal';
import Header from '../../components/Header/Loadable'
import axios from 'axios'

/* eslint-disable react/prefer-stateless-function */
export class AdminPage extends React.PureComponent {

  state = {
    isLoader: false
  }


  changeShopStatusHandler = event => {
    event.preventDefault();

    let id = event.target.id;
    let payload = { status: id }

    let url = id == "open" ? window.API_URL + `/shopStatus/open` : window.API_URL + `/shopStatus/close`;
    axios.patch(url, payload)
      .then((res) => {
        this.setState({
          isLoader: false,
          message: id == "open" ? "shop Open Successfully" : "Shop Close Successfully",
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
          <title>AdminPage</title>
          <meta name="description" content="Description of AdminPage" />
        </Helmet>
        <Header />

        <p className="offers-heading">Shop Status</p>

        <div className="offers-page-outer row">
          {this.state.isLoader ?
            <div className="lds-dual-ring"></div>
            :
            <React.Fragment>
              <div className="row">
                <div className="col-md-6">
                  <button type="button" id="open" onClick={this.changeShopStatusHandler} className="btn btn-success admin-shop-status-btn">Open</button>
                </div>
                <div className="col-md-6">
                  <button type="button" id="close" onClick={this.changeShopStatusHandler} className="btn btn-danger admin-shop-status-btn">Close</button>
                </div>
              </div>
            </React.Fragment>
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

AdminPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  adminPage: makeSelectAdminPage(),
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

const withReducer = injectReducer({ key: 'adminPage', reducer });
const withSaga = injectSaga({ key: 'adminPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(AdminPage);
