import React from 'react';
import { StyleSheet, View } from 'react-native';

import ChooseLanguage from '../../components/ChooseLanguage/ChooseLanguage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class LanguageScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ChooseLanguage
          onHumanTranslation={() => navigate('Email')}
          onMachineTranslation={() => navigate('Email')}
        />
      </View>
    );
  }
}
