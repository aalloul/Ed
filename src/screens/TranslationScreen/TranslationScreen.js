import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import TranslationForm from '../../components/TranslationForm/TranslationForm';
import {
  changeLanguage,
  selectTranslation,
} from '../../actions/applicationActions';

import { headerStyle } from '../../common/navigationHelpers';
import { debounceTaps } from '../../common/commonHelpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class TranslationScreen extends PureComponent {
  static navigationOptions = {
    title: "Your language",
    ...headerStyle,
  };

  constructor() {
    super();

    this.selectTranslation = debounceTaps(this.selectTranslation.bind(this));
  }

  selectTranslation(translation) {
    this.props.selectTranslation(translation);
  }

  render() {
    const { changeLanguage, language, languages } = this.props;

    return (
      <View style={styles.container}>
        <TranslationForm
          onHumanTranslationPress={() => this.selectTranslation('human')}
          onMachineTranslationPress={() => this.selectTranslation('machine')}
          onLanguageChange={language => changeLanguage(language)}
          language={language}
          languages={languages}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ application }) => ({
  language: application.language,
  languages: application.languages,
});

const mapDispatchToProps = dispatch => ({
  changeLanguage(language) {
    dispatch(changeLanguage(language));
  },
  selectTranslation(translation) {
    dispatch(selectTranslation(translation));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TranslationScreen);
