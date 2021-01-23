/**
 *
 * SamplePage
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
import makeSelectSamplePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class SamplePage extends React.PureComponent {
  render() {
    return (
      <div>
        <Helmet>
          <title>SamplePage</title>
          <meta name="description" content="Description of SamplePage" />
        </Helmet>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

SamplePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  samplePage: makeSelectSamplePage(),
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

const withReducer = injectReducer({ key: 'samplePage', reducer });
const withSaga = injectSaga({ key: 'samplePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SamplePage);
