import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';

import EmailForm from '../EmailForm/EmailForm';

const EmailModal = ({ onPress, visible, navigation }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={() => {
      alert("Modal has been closed.")
    }}
  >
    <EmailForm
      onPress={() => navigation.navigate('Success')}
    />
  </Modal>
);

EmailModal.propTypes = {
  onPress: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default EmailModal;