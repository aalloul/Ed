import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import RoundButton from '../Buttons/RoundButton';

const ChooseLanguage = ({ onHumanTranslation, onMachineTranslation }) => (
  <View>
    <Text>How do want your translation?</Text>

    <Text>Choose language (English by default)</Text>

    <Text>Human translation &mdash; €1 (price depends on the number of chars)</Text>

    <RoundButton
      onPress={onHumanTranslation}
      iconSource={require('../../components/ChooseLanguage/HumanTranslationIcon.png')}
    />
    <RoundButton
      onPress={onMachineTranslation}
      iconSource={require('../../components/ChooseLanguage/MachineTranslationIcon.png')}
    />

  </View>
);

ChooseLanguage.displayName = 'ChooseLanguage';

ChooseLanguage.propTypes = {
  onHumanTranslation: PropTypes.func.isRequired,
  onMachineTranslation: PropTypes.func.isRequired,
};

export default ChooseLanguage;
