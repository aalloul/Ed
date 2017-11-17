import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal } from 'react-native';

import TranslationForm from '../TranslationForm/TranslationForm';

const TranslationModal = ({ onPress, visible, navigation, language, onLanguageChange }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={() => {
      alert("Modal has been closed.")
    }}
  >
    <View style={{ marginTop: 22 }}>
      <TranslationForm
        onHumanTranslationPress={() => navigation.navigate('Email')}
        onMachineTranslationPress={() => navigation.navigate('Email')}
        onLanguageChange={onLanguageChange}
        language={language}
      />
    </View>
  </Modal>
);

TranslationModal.propTypes = {
  onPress: PropTypes.func,
  visible: PropTypes.bool,
};

export default TranslationModal;
