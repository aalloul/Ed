import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Picker } from 'react-native';

import RectangularButton from '../Buttons/RectangularButton';
import PrimaryText from '../Texts/PrimaryText';
import SecondaryText from '../Texts/SecondaryText';
import IconButton from '../Buttons/IconButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 180,
    width: 360,
  },
  actionButton: {
    alignItems: 'center',
    flexDirection: 'column',
    height: 180,
    width: 150,
  },
  actionIcon: {

  },
  actionTitle: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginLeft: 0,
  },
  humanIcon: {
    width: 40,
    height: 70,
  },
  machineIcon: {
    width: 60,
    height: 50,
  },
});

const TranslationForm = ({
  onHumanTranslationPress,
  onMachineTranslationPress,
  onLanguageChange,
  language,
  languages,
  loading,
}) => (
  <View style={styles.container}>
    <PrimaryText>
      How do want{'\n'}
      your translation?
    </PrimaryText>

    <Picker
      style={{ width: 300 }}
      selectedValue={language}
      onValueChange={language => onLanguageChange(language)}
    >
      {languages.map(({ label, code }) => <Picker.Item label={label} value={code} key={code} />)}
    </Picker>

    <View style={styles.actions}>
      <IconButton
        onPress={onHumanTranslationPress}
        buttonStyle={styles.actionButton}
        iconSource={require('./HumanIcon.png')}
        iconStyle={{
          width: 54,
          height: 70,
          marginTop: 20,
          marginBottom: 20,
        }}
        title="Human"
        titleStyle={styles.actionTitle}
        price="€3"
        loading={loading}
      />
      <IconButton
        onPress={onMachineTranslationPress}
        buttonStyle={styles.actionButton}
        iconSource={require('./MachineIcon.png')}
        iconStyle={{
          width: 60,
          height: 50,
          marginTop: 30,
          marginBottom: 30,
        }}
        title="Auto"
        titleStyle={styles.actionTitle}
        price="FREE"
        loading={loading}
      />
    </View>
  </View>
);

TranslationForm.displayName = 'TranslationForm';

TranslationForm.propTypes = {
  onHumanTranslationPress: PropTypes.func.isRequired,
  onMachineTranslationPress: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  language: PropTypes.oneOf(['en', 'es', 'ru', 'fr', 'nl']),
  languages: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

TranslationForm.defaultProps = {
  language: 'en',
};

export default TranslationForm;
