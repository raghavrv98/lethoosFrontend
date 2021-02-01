/**
 *
 * LoginPage
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
import makeSelectLoginPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { cloneDeep } from 'lodash';
import axios from 'axios';

/* eslint-disable react/prefer-stateless-function */
export class LoginPage extends React.PureComponent {

  state = {
    boxContent: "login",
    isLoader: false,
    isDetailsIncorrect: false,
    payload: {
      name: "",
      mobileNumber: "",
      password: ""
    }
  }

  inputChangeHandler = event => {
    let payload = cloneDeep(this.state.payload)
    payload[event.target.id] = event.target.value
    this.setState({
      payload,
      isDetailsIncorrect: false,
      isUserExist: false
    })
  }

  onSubmitHandler = event => {
    let id = event.target.id
    let payload = cloneDeep(this.state.payload)
    this.setState({
      isLoader: true,
      isDetailsIncorrect: false,
      isUserExist: false
    }, () => id == "signUp" ? this.customerSignUp(payload) : id == "login" ? this.customerLogin(payload) : this.resetPassword(payload))
  }

  customerSignUp = (payload) => {
    let url = window.API_URL + "/customerLogin";
    axios.post(url, payload)
      .then((res) => {
        const customerDetails = res.data.data;
        if (Object.keys(customerDetails).length > 0) {
          sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails))
          this.props.history.push('/landingPage')
        }
        else {
          this.setState({
            isUserExist: true,
            isLoader: false,
            isDetailsIncorrect: false
          })
        }
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });
  }

  customerLogin = (payload) => {
    let url = window.API_URL + "/customerCheck";
    axios.post(url, payload)
      .then((res) => {
        const customerDetails = res.data.data;
        if (Object.keys(customerDetails).length > 0) {
          sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails))
          this.props.history.push('/landingPage')
        }
        else {
          this.setState({
            isDetailsIncorrect: true,
            isLoader: false,
            isUserExist: false
          })
        }
      })
      .catch((error) => {
        let message = errorHandler(error);
        this.setState({
          message,
          type: "failure"
        }, () => setTimeout(this.modalTime, 1500))
      });
  }



  modalTime = () => {
    this.setState({
      isOpenClassName: 'modal display-none container',
      isLoader: false
    })
  }

  stopLoaderHandler = () => {
    setTimeout(() => {
      this.setState({
        isLoader: false
      },
        // () => this.props.history.push('/landingPage')
      )
    }, 1000);
  }

  changeContentHandler = event => {
    this.setState({
      boxContent: event.target.id,
      payload: {
        name: "",
        mobileNumber: "",
        password: ""
      },
      isDetailsIncorrect: false,
      isUserExist: false
    })
  }


  render() {
    return (
      <div>
        <Helmet>
          <title>LoginPage</title>
          <meta name="description" content="Description of LoginPage" />
        </Helmet>
        <div className="loginPage row">
          <img className="loginBanner display-none" src={require('../../assets/images/loginBanner.png')} />
          <span className="loginbox">
            <img className="login-box-icon img-responsive" src={require('../../assets/images/logo.png')} />
            <p className="welcome-message">Welcome To The Land Of Tastiest Food</p>
            {this.state.isDetailsIncorrect && <p className="incorrect-password-text">Incorrect Mobile Number or Password</p>}
            {this.state.isUserExist && <p className="incorrect-password-text">User Already Exist</p>}
            {this.state.isLoader ? <div className="lds-dual-ring"></div> :
              this.state.boxContent === "login" ?
                <form className="mr-t-45" id="login" onSubmit={this.onSubmitHandler}>
                  <div className="form-group">
                    <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                    <input value={this.state.payload.mobileNumber} id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required />
                  </div>
                  <div className="form-group">
                    <label className="box-label" htmlFor="inputlg">Password</label>
                    <input value={this.state.payload.password} id="password" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-warning login-button">Login</button>
                  </div>
                </form> :
                this.state.boxContent === "signUp" ?
                  <form className="mr-t-45" id="signUp" onSubmit={this.onSubmitHandler}>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Name</label>
                      <input value={this.state.payload.name} id="name" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                      <input value={this.state.payload.mobileNumber} id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required />
                    </div>
                    <div className="form-group">
                      <label className="box-label" htmlFor="inputlg">Password</label>
                      <input value={this.state.payload.password} id="password" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-warning login-button">Sign Up</button>
                    </div>
                  </form>
                  :

                  <div className="reset-password-text">
                    <p> Please Contact Admin.</p>
                    <p> Send Your Password request on Whatsapp at 8192095423.</p>
                  </div>

              // <form className="mr-tb-45" id="resetPassword" onSubmit={this.onSubmitHandler}>
              //   <div className="form-group">
              //     <label className="box-label" htmlFor="inputlg">Mobile Number</label>
              //     <input value={this.state.payload.mobileNumber} id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required />
              //   </div>
              //   <div className="form-group">
              //     <button type="submit" className="btn btn-warning login-button">Send Password</button>
              //   </div>
              // </form>
            }

            {this.state.boxContent !== "login" && !this.state.isLoader && <p onClick={this.changeContentHandler} id="login" className="reset-password"> Login</p>}
            {this.state.boxContent !== "resetPassword" && !this.state.isLoader && <p onClick={this.changeContentHandler} id="resetPassword" className="reset-password"> Reset Password</p>}
            {this.state.boxContent !== "signUp" && !this.state.isLoader && <p onClick={this.changeContentHandler} id="signUp" className="sign-up"> Don't have an account? Sign up</p>}
          </span>
        </div>

      </div>
    );
  }
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginPage: makeSelectLoginPage(),
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

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LoginPage);
