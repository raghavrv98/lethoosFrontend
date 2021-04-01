/**
 *
 * NotifyModalBox
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import history from 'utils/history'


function NotifyModalBox(props) {
  return (
    <div className="modal display-block">
      <div className="modal-dialog-notify-box" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title confirm-modal-heading">{props.heading}</h5>
            {/* <button type="button" className="close confirm-modal-close" onClick={() => { props.onClose() }}>
              <i className="fa fa-times-circle" aria-hidden="true"></i>
            </button> */}
          </div>
          <div className="modal-body confirm-modal-body">
            <span className="notify-icon-size">
              <i className="fa fa-user-circle-o" aria-hidden="true"></i>
            </span>
            <p>Please update your Profile.</p>
            <p>It will take only 5 seconds.</p>
            <button onClick={() => history.push('/profilePage')} className="btn btn-warning login-button place-order-button">Update profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

NotifyModalBox.propTypes = {};

export default NotifyModalBox;
