/**
 *
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Route, Switch } from 'react-router-dom';
import makeSelectHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';

import LandingPage from '../../containers/LandingPage/Loadable';
import LoginPage from '../../containers/LoginPage/Loadable';

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.PureComponent {

  componentDidMount(){
    // this.props.history.push('/landingPage');
  }

  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/landingPage" render={props => <LandingPage {...props} />} />
          <Route exact path="/login" render={props => <LoginPage {...props} />} />
        </Switch>
      </React.Fragment>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  homePage: makeSelectHomePage(),
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

const withReducer = injectReducer({ key: 'homePage', reducer });
const withSaga = injectSaga({ key: 'homePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
