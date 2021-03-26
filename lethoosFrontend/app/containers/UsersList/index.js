/**
 *
 * UsersList
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
import makeSelectUsersList from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import MessageModal from '../../components/MessageModal';
import ConfirmModal from '../../components/ConfirmModal';
import Header from '../../components/Header/Loadable'
import axios from 'axios'
import ReactTable from 'react-table-v6'
import moment from 'moment';
import { filterCaseInsensitive } from '../../utils/customUtils'

/* eslint-disable react/prefer-stateless-function */
export class UsersList extends React.PureComponent {

  state = {
    customerDetails: {},
    isLoader: true,
    type: "success",
    usersList: [],
    isDeleteConfirmModal: false
  }

  componentWillMount() {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }
    this.setState({
      customerDetails
    }, () => this.usersListHandler(), this.customerDetailsHandler())
  }

  customerDetailsHandler = () => {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    let url = window.API_URL + `/customerLogin/${customerDetails._id}`;
    axios.get(url)
      .then((res) => {
        const customerDetails = res.data;
        sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails))
        this.setState({
          customerDetails,
          isLoader: false
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

  usersListHandler = () => {
    let url = window.API_URL + `/usersList`;
    axios.get(url)
      .then((res) => {
        const usersList = res.data.reverse();
        this.setState({
          usersList,
          isLoader: false
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

  modalCloseHandler = () => {
    setTimeout(() => {
      this.setState({
        isMessageModal: false,
        isDeleteConfirmModal: false
      })
    }, 1000);
  }

  confirmModalCloseHandler = () => {
    this.setState({
      isMessageModal: false,
      isDeleteConfirmModal: false
    })
  }

  confirmModalHandler = (id) => {
    this.setState({
      userDeleteId: id,
      isDeleteConfirmModal: true
    })
  }

  userDeleteHandler = () => {
    let url = window.API_URL + `/customerLogin/${this.state.userDeleteId}`;
    axios.delete(url)
      .then((res) => {
        this.setState({
          isLoader: true,
          message: "User deleted successfully",
          isMessageModal: true,
          isDeleteConfirmModal: false,
          type: "success"
        }, () => this.modalCloseHandler(), this.usersListHandler())
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

  render() {

    const columns = [{
      Header: 'Name',
      accessor: 'name',
      filterable: true,
    },
    {
      Header: 'Password',
      accessor: 'password',
      filterable: true,
    },
    {
      Header: 'Mobile Number',
      accessor: 'mobileNumber',
      filterable: true,
    },
    {
      Header: 'Alternate Mobile Number',
      accessor: 'alternateMobileNumber',
      filterable: true,
    },
    {
      Header: 'Address',
      accessor: 'address',
      filterable: true,
    },
    {
      Header: 'Orders Count',
      accessor: 'orderHistory',
      Cell: row => (
        <div>{row.original.orderHistory.length}</div>
      )
    },
    {
      Header: 'Created At',
      accessor: 'date',
      Cell: row => (
        <div>{moment(row.original.date).format("DD MMM YYYY HH:mm")}</div>
      )
    },
    {
      Header: 'Area',
      accessor: 'area',
      filterable: true,
    },
    {
      Header: "Actions",
      filterable: false,
      Cell: row => (
        <div>
          <button type="button" className="btn-transparent" onClick={() => this.props.history.push(`/manageRoleNavigation/${row.original.id}`)}>
            <i className="fa fa-sign-in" />
          </button>

          <button type="button" className="btn-transparent text-success" onClick={() => { this.props.history.push(`/addOrEditRole/${row.original.id}`); }}>
            <i className="fa fa-pencil-square-o" />
          </button>

          <button type="button" className="btn-transparent text-danger" onClick={() => this.confirmModalHandler(row.original._id)}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
      sortable: false,
    },
    ]

    return (
      <div>
        <Helmet>
          <title>customers List</title>
          <meta name="description" content="Description of customers List" />
        </Helmet>
        <Header />

        <p className="offers-heading">Users ({this.state.usersList ? this.state.usersList.length : 0})</p>
        <div className="react-table-outer">
          <div className="customReactTableBox">
            <ReactTable
              className="customReactTable"
              data={this.state.usersList}
              columns={columns}
              defaultPageSize={10}
              noDataText={this.state.isLoader ? "" : "There is no data to display."}
              loading={this.state.isLoader}
              loadingText={"Loading ..."}
              defaultFilterMethod={filterCaseInsensitive}
              PreviousComponent={(props) => <button type="button"{...props}><i className="fa fa-angle-left"></i></button>}
              NextComponent={(props) => <button type="button" {...props}><i className="fa fa-angle-right"></i></button>}
            />
          </div>
        </div>

        {this.state.isMessageModal && <MessageModal
          modalType={this.state.type}
          message={this.state.message}
          onClose={this.modalCloseHandler}
        />}

        {this.state.isDeleteConfirmModal && <ConfirmModal
          heading="User"
          message="Are you sure want to delete user?"
          onClose={this.confirmModalCloseHandler}
          deleteHandler={this.userDeleteHandler}
        />}

      </div>
    );
  }
}

UsersList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  usersList: makeSelectUsersList(),
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

const withReducer = injectReducer({ key: 'usersList', reducer });
const withSaga = injectSaga({ key: 'usersList', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(UsersList);
