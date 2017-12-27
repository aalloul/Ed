import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import TranslationForm from '../../components/TranslationForm/TranslationForm';
import { changeLanguage, selectTranslation } from '../../actions/applicationActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class TranslationScreen extends Component {
  static navigationOptions = {
    title: "Select your language",
    headerStyle: {
      backgroundColor: '#50D2C2',
    },
  };

  selectTranslation(translation) {
    this.props.selectTranslation(translation);
  }

  render() {
    return (
      <View style={styles.container}>
        <TranslationForm
          onHumanTranslationPress={() => this.selectTranslation('human')}
          onMachineTranslationPress={() => this.selectTranslation('machine')}
          onLanguageChange={language => this.props.changeLanguage(language)}
          language={this.props.language}
          languages={this.props.languages}
        />
      </View>
    );
  }
}

export default connect(
  ({ app }) => ({
    language: app.language,
    languages: app.languages,
  }),
  dispatch => ({
    changeLanguage(language) {
      dispatch(changeLanguage(language))
    },
    selectTranslation(translation) {
      dispatch(selectTranslation(translation))
    },
  })
)(TranslationScreen);
