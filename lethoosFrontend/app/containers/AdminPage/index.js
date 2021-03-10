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
    isLoader: true,
    shops: []
  }


  componentDidMount() {
    this.getShops()
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
        }, () => this.modalCloseHandler(), this.shopUpdateHandler())
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

  shopUpdateHandler = () => {
    this.setState({
      isLoader: true
    }, () => this.getShops())
  }

  getShops = () => {
    let url = window.API_URL + "/shop";
    axios.get(url)
      .then((res) => {
        const shops = res.data;
        shops.sort((a, b) => (a.priority - b.priority))
        this.setState({ shops, isLoader: false });
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
              <div className="row mr-b-30">
                <div className="col-md-4">
                  <p className="status-text">All Shops Status</p>
                </div>
                <div className="col-md-4">
                  <button type="button" id="open" onClick={this.changeShopStatusHandler} className="btn btn-success admin-shop-status-btn">Open</button>
                </div>
                <div className="col-md-4">
                  <button type="button" id="close" onClick={this.changeShopStatusHandler} className="btn btn-danger admin-shop-status-btn">Close</button>
                </div>
              </div>

              <div className="row">

                {this.state.shops.length > 0 ?
                  this.state.shops.map((val, index) => {
                    return <div key={index} onClick={() => this.props.history.push(`/admin/shopDetails/${val._id}`)} className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
                  })
                  :
                  <div className="no-shops-found">
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
