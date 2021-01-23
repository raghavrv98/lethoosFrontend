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
      <div className={props.showHideClassName}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
          <div className={props.showHideClassName} >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-radius-16-r">
                <div
                  className={props.modalType == "success" ? "modal-header message-modal-success-background-r" : "modal-header message-modal-failure-background-r"}
                >
                  <span className={props.modalType == "success" ? "message-modal-success-text-r" : "message-modal-failure-text-r"}>{props.message}</span>
                  <button
                    type="button"
                    className="close"
                    onClick={() => { props.onClose() }}
                    aria-label="Close"
                  >
                    <i className="fa fa-times" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MessageModal.propTypes = {};

export default MessageModal;
