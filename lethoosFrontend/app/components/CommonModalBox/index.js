/**
 *
 * CommonModalBox
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function CommonModalBox(props) {
  return (
    <div className="modal display-block">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title confirm-modal-heading">{props.heading}</h5>
            <button type="button" className="close confirm-modal-close" onClick={() => { props.onClose() }}>
              <i className="fa fa-times-circle" aria-hidden="true"></i>
            </button>
          </div>
          <div className="modal-body confirm-modal-body">
            <video controls src={require('../../assets/images/video2.mp4')}>
              Your browser does not support the video tag.
          </video>
          </div>
        </div>
      </div>
    </div>
  );
}

CommonModalBox.propTypes = {};

export default CommonModalBox;
