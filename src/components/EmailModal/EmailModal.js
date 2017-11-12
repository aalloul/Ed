import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';

import ChooseEmail from '../ChooseEmail/ChooseEmail';

const EmailModal = ({ onPress, visible }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={() => {
      alert("Modal has been closed.")
    }}
  >
    <ChooseEmail onPressSend={onPress} />
  </Modal>
);

EmailModal.propTypes = {
  onPress: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default EmailModal;