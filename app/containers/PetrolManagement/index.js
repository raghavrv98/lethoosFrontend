/**
 *
 * PetrolManagement
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
import makeSelectPetrolManagement from './selectors';
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
export class PetrolManagement extends React.PureComponent {

  state = {
    customerDetails: {},
    isLoader: true,
    type: "success",
    petrolSlip: [],
    isDeleteConfirmModal: false
  }

  componentWillMount() {
    let customerDetails = JSON.parse(sessionStorage.getItem("customerDetails")) ? JSON.parse(sessionStorage.getItem("customerDetails")) : this.state.customerDetails;
    if (Object.keys(customerDetails).length == 0) {
      this.props.history.push('/login')
    }
    this.setState({
      customerDetails
    }, () => this.petrolSlipHandler(), this.customerDetailsHandler())
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

  petrolSlipHandler = () => {
    let url = window.API_URL + `/petrolDetailsAll`;
    axios.get(url)
      .then((res) => {
        const petrolSlip = res.data.reverse();
        this.setState({
          petrolSlip,
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
      petrolSlipDeleteId: id,
      isDeleteConfirmModal: true
    })
  }

  petrolSlipDeleteHandler = () => {
    let url = window.API_URL + `/petrolDetailsDelete/${this.state.petrolSlipDeleteId}`;
    axios.delete(url)
      .then((res) => {
        this.setState({
          isLoader: true,
          message: "petrol Slip deleted successfully",
          isMessageModal: true,
          isDeleteConfirmModal: false,
          type: "success"
        }, () => this.modalCloseHandler(), this.petrolSlipHandler())
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
      Header: 'Amount',
      accessor: 'amount',
      filterable: true,
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: row => (
        <div>{moment(row.original.date).format("DD MMM YYYY HH:mm")}</div>
      )
    },
    {
      Header: 'Previous Km',
      accessor: 'previousKm',
      filterable: true,
    },
    {
      Header: 'Current Km',
      accessor: 'currentKm',
      filterable: true,
    },
    {
      Header: 'Total Km',
      accessor: '',
      filterable: true,
      Cell: row => (
        <div>{(row.original.currentKm - row.original.previousKm) / 10}</div>
      )
    },
    {
      Header: 'Petrol Price',
      accessor: 'petrolPrice',
      filterable: true,
    },
    {
      Header: 'Petrol Pump Place',
      accessor: 'petrolPumpPlace',
      filterable: true,
    },
    {
      Header: 'Bike Name',
      accessor: 'bikeName',
      filterable: true
    },
    {
      Header: 'Bike Number',
      accessor: 'bikeNumber',
      filterable: true
    },
    {
      Header: 'Bike Average',
      accessor: '',
      Cell: row => (
        <div>{(row.original.amount / (row.original.currentKm - row.original.previousKm)).toFixed(2)} Rs/km</div>
      )
    },
    {
      Header: "Actions",
      filterable: false,
      Cell: row => (
        <div>
          <button type="button" className="btn-transparent text-success" onClick={() => { this.props.history.push(`/petrolSlipDetails/${row.original._id}`); }}>
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
          <title>Petrol Management</title>
          <meta name="description" content="Description of Petrol Management" />
        </Helmet>
        <Header />

        <p className="offers-heading">Petrol Slips ({this.state.petrolSlip ? this.state.petrolSlip.length : 0})</p>
        <div className="add-btn"><button onClick={() => { this.props.history.push(`/petrolSlipDetails`) }} className="btn btn-info add-btn-css">Add</button></div>
        <div className="react-table-outer">
          <div className="customReactTableBox">
            <ReactTable
              className="customReactTable"
              data={this.state.petrolSlip}
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
          heading="petrolSlip"
          message="Are you sure want to delete Petrol Slip?"
          onClose={this.confirmModalCloseHandler}
          deleteHandler={this.petrolSlipDeleteHandler}
        />}

      </div>
    );
  }
}

PetrolManagement.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  petrolManagement: makeSelectPetrolManagement(),
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

const withReducer = injectReducer({ key: 'petrolManagement', reducer });
const withSaga = injectSaga({ key: 'petrolManagement', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(PetrolManagement);
