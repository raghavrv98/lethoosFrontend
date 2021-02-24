/**
 *
 * MessageModal
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function MessageModal(props) {
  return (
    <div>
      <div className={`msg-modal-box-position ${props.modalType === "success" ? "msg-modal-success" : "msg-modal-failure"}`}>{props.message}<span className="msg-modal-times-position"><i onClick={() => window.location.reload()} className="fa fa-window-close-o" aria-hidden="true"></i></span>
      </div>
    </div >
  );
}

MessageModal.propTypes = {};

export default MessageModal;
