import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import TranslationForm from '../../components/TranslationForm/TranslationForm';
import {
  changeLanguage,
  disableButtonLoadingRoutine,
  enableButtonLoadingRoutine,
  selectTranslation,
} from '../../actions/applicationActions';

import { headerStyle } from '../../common/navigationOptions';

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
    ...headerStyle,
  };

  componentDidMount() {
    this.props.disableButtonLoading();
  }

  selectTranslation(translation) {
    this.props.enableButtonLoading()
      .then(this.props.selectTranslation.bind(null, translation));
  }

  render() {
    const { changeLanguage, language, languages, loading } = this.props;

    return (
      <View style={styles.container}>
        <TranslationForm
          onHumanTranslationPress={() => this.selectTranslation('human')}
          onMachineTranslationPress={() => this.selectTranslation('machine')}
          onLanguageChange={language => changeLanguage(language)}
          language={language}
          languages={languages}
          loading={loading}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ application }) => ({
  loading: application.loading,
  language: application.language,
  languages: application.languages,
});

const mapDispatchToProps =dispatch => ({
  changeLanguage(language) {
    dispatch(changeLanguage(language))
  },
  selectTranslation(translation) {
    dispatch(selectTranslation(translation))
  },
  enableButtonLoading() {
    return dispatch(enableButtonLoadingRoutine());
  },
  disableButtonLoading() {
    return dispatch(disableButtonLoadingRoutine());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TranslationScreen);
