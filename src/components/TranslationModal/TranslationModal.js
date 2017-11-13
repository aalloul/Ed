import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, Text } from 'react-native';

import RoundButton from '../Buttons/RoundButton';

const TranslationModal = ({ onPress, visible }) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={visible}
    onRequestClose={() => {
      alert("Modal has been closed.")
    }}
  >
    <View style={{ marginTop: 22 }}>
      <View>
        <Text>How do want your translation?</Text>

        <Text>Choose language (English by default)</Text>

        <Text>Human translation &mdash; €1 (price depends on the number of chars)</Text>
        <RoundButton
          onPress={onPress}
          iconSource={require('../../screens/ScanScreen/ScanIcon.png')}
        />
      </View>
    </View>
  </Modal>
);

TranslationModal.propTypes = {
  onPress: PropTypes.func,
  visible: PropTypes.bool,
};

export default TranslationModal;
