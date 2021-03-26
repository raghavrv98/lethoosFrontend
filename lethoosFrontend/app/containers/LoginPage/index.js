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
import { errorHandler } from "../../utils/customUtils";
import MessageModal from '../../components/MessageModal';

import firebase from './../../firebase'

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
      isUserExist: false,
      isMessageModal: false,
      isSMSSent: false,
      isSMSSentError: false,
      isCaptchaLoading: false
    })
  }

  customerSignUp = (payload) => {
    let url = window.API_URL + "/customerLogin";
    axios.post(url, payload)
      .then((res) => {
        const customerDetails = res.data.data;
        if (Object.keys(customerDetails).length > 0) {
          sessionStorage.setItem("customerDetails", JSON.stringify(customerDetails))
          customerDetails.coupon.length === 0 && this.addingDiscountCopuons()
          this.props.history.push('/landingPage')
        }
        else {
          this.setState({
            isUserExist: true,
            isLoader: false,
            isDetailsIncorrect: false,
            isCaptchaLoading: false
          })
        }
      })
      .catch((error) => {
        this.setState({
          isLoader: false,
          message: "Some Error Occured",
          isMessageModal: true,
          type: "failure",
          isCaptchaLoading: false
        })
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
        this.setState({
          isLoader: false,
          message: "Some Error Occured",
          isMessageModal: true,
          type: "failure"
        })
      });
  }


  addingDiscountCopuons = () => {
    let id = JSON.parse(sessionStorage.getItem('customerDetails'))._id
    let url = window.API_URL + `/customerLogin/coupons/${id}`;
    axios.patch(url, {})
      .then((res) => {
        const couponAdded = res.data;
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

  changeContentHandler = event => {
    this.setState({
      boxContent: event.target.id,
      payload: {
        name: "",
        mobileNumber: "",
        password: ""
      },
      isDetailsIncorrect: false,
      isUserExist: false,
      isMessageModal: false,
      isSMSSent: false,
      isSMSSentError: false,
      isCaptchaLoading: false
    })
  }

  resetPassword = (payload) => {
    let url = window.API_URL + "/customerLogin/forgotPassword";
    axios.post(url, payload)
      .then((res) => {
        const data = res.data.data;
        if (data.length > 0) {
          this.setState({
            isSMSSent: true,
            isLoader: false,
            isSMSSentError: false,
            isCaptchaLoading: false
          })
        }
        else {
          this.setState({
            isSMSSent: false,
            isLoader: false,
            isSMSSentError: true,
            isCaptchaLoading: false
          })
        }
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

  onSubmitHandler = id => {
    let payload = cloneDeep(this.state.payload)
    payload.name = payload.name.trim()
    payload.mobileNumber = payload.mobileNumber.trim()
    payload.password = payload.password.trim()

    this.setState({
      isLoader: true,
      isCaptchaLoading: true,
      isDetailsIncorrect: false,
      isUserExist: false
    }, () => id == "signUp" ? this.customerSignUp(payload) : id == "login" ? this.customerLogin(payload) : this.resetPassword(payload))
  }

  setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        this.onSignInSubmit();
      }
    });
    this.setState({
      isCaptchaLoading: true
    })
  }

  onSignInSubmit = (event) => {
    event.preventDefault();
    this.setUpRecaptcha();
    const phoneNumber = `+91${this.state.payload.mobileNumber}`;
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        this.setState({
          isCaptchaLoading: false
        })
        const code = window.prompt('Enter OTP');
        confirmationResult.confirm(code).then((result) => {
          // User signed in successfully.
          const user = result.user;
          this.onSubmitHandler('signUp')
          // ... 
        }).catch((error) => {
          // User couldn't sign in (bad verification code?)
          console.log('error: ', error);
          this.setState({
            message: "Incorrect OTP. Please try again",
            isMessageModal: true,
            type: "failure"
          }, () => {
            setTimeout(() => {
              window.location.reload()
            }, 1500);
          })

        });
      }).catch((error) => {
        console.log('error: ', error);
        // Error; SMS not sent
        this.setState({
          message: "Error Occurs. Please try again later",
          isMessageModal: true,
          type: "failure"
        })
      });
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
          <img className="loginBackground" src={require('../../assets/images/loginBackground.jpg')} />
          <span className="loginbox">
            <img className="login-box-icon img-responsive" src={require('../../assets/images/logo.png')} />
            <p className="welcome-message">Welcome To The Land Of Tastiest Food</p>
            <div id="recaptcha-container"></div>
            <label></label>
            {this.state.isDetailsIncorrect && <p className="incorrect-password-text">Incorrect Mobile Number or Password</p>}
            {this.state.isUserExist && <p className="incorrect-password-text">User Already Exist<br />Please Login</p>}
            {this.state.isLoader ? <div className="lds-dual-ring"></div> :
              this.state.boxContent === "login" ?
                <form className="mr-t-45" onSubmit={() => this.onSubmitHandler('login')}>
                  <div className="form-group">
                    <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                    <input value={this.state.payload.mobileNumber} title="Enter 10 digit mobile number" id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required />
                  </div>
                  <div className="form-group">
                    <label className="box-label" htmlFor="inputlg">Password</label>
                    <input value={this.state.payload.password} id="password" onChange={this.inputChangeHandler} className="form-control input-lg" type="password" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-warning login-button">Login</button>
                  </div>
                </form> :
                this.state.boxContent === "signUp" ?
                  <React.Fragment>

                    {this.state.isCaptchaLoading && <div className="loading">
                      <p>Please wait</p>
                      <span><i></i><i></i></span>
                    </div>}

                    <form className="mr-t-45" id="signUp" onSubmit={this.onSignInSubmit}>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Name</label>
                        <input value={this.state.payload.name} id="name" onChange={this.inputChangeHandler} className="form-control input-lg" type="text" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                        <input value={this.state.payload.mobileNumber} pattern="[1-9]{1}[0-9]{9}" title="Enter 10 digit mobile number" id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required />
                      </div>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Password</label>
                        <input value={this.state.payload.password} id="password" onChange={this.inputChangeHandler} className="form-control input-lg" type="password" required />
                      </div>
                      <div className="form-group">
                        <button type="submit" disabled={this.state.isCaptchaLoading} className="btn btn-warning login-button">Sign Up</button>
                      </div>
                    </form>
                  </React.Fragment>
                  :
                  // <div className="reset-password-text">
                  //   <p> Please Contact Admin.</p>
                  //   <p> Send Your Password request on Whatsapp at 8192095423.</p>
                  // </div>
                  <React.Fragment>
                    {this.state.isSMSSent && <p className="success-text">SMS sent<br />Please check text message</p>}
                    {this.state.isSMSSentError && <p className="error-text">Incorrect Mobile Number</p>}
                    <form className="mr-tb-45" id="resetPassword" onSubmit={this.onSubmitHandler}>
                      <div className="form-group">
                        <label className="box-label" htmlFor="inputlg">Mobile Number</label>
                        <input value={this.state.payload.mobileNumber} id="mobileNumber" onChange={this.inputChangeHandler} className="form-control input-lg" type="tel" required />
                      </div>
                      <div className="form-group">
                        <button type="submit" className="btn btn-warning login-button">Send Password</button>
                      </div>
                    </form>
                  </React.Fragment>
            }

            {this.state.boxContent !== "login" && !this.state.isLoader && <p onClick={this.changeContentHandler} id="login" className="reset-password"> Login</p>}
            {this.state.boxContent !== "signUp" && !this.state.isLoader && <p onClick={this.changeContentHandler} id="signUp" className="sign-up"> Create an Account</p>}
            {this.state.boxContent !== "resetPassword" && !this.state.isLoader && <p onClick={this.changeContentHandler} id="resetPassword" className="reset-password"> Reset Password</p>}
          </span>
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
