/**
 *
 * ConfirmModal
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function ConfirmModal(props) {
  return (
    <div>
      <div className="modal display-block">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title confirm-modal-heading">{props.heading} Confirmation</h5>
              <button type="button" className="close confirm-modal-close" onClick={() => { props.onClose() }}>
                <i className="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </div>
            <div className="modal-body confirm-modal-body">
              {props.message}
              </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary confirm-modal-no" onClick={() => { props.onClose() }}>No</button>
              <button type="button" className="btn btn-secondary confirm-modal-yes" onClick={() => { props.deleteHandler() }}>Yes</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

ConfirmModal.propTypes = {};

export default ConfirmModal;
