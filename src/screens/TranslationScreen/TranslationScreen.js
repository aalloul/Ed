import React from 'react';
import { StyleSheet, View } from 'react-native';

import TranslationForm from '../../components/TranslationForm/TranslationForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class TranslationScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      language: 'en',
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <TranslationForm
          onHumanTranslationPress={() => navigate('Email')}
          onMachineTranslationPress={() => navigate('Email')}
          onLanguageChange={language => this.setState({ language })}
          language={this.state.language}
        />
      </View>
    );
  }
}
