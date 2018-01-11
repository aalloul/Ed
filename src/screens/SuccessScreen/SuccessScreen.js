import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, View, Image, Text } from 'react-native';
import RNRestart from 'react-native-restart';
import Confetti from 'react-native-confetti';

import PrimaryText from '../../components/Texts/PrimaryText';
import SecondaryText from '../../components/Texts/SecondaryText';
import RectangularButton from '../../components/Buttons/RectangularButton';

import { headerStyle } from '../../common/navigationOptions';
import { enableButtonLoading, disableButtonLoading } from '../../actions/applicationActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  bold: {
    fontWeight: "bold",
  },
  image: {
    height: 115,
    marginBottom: 35,
    marginTop: 35,
    width: 150,
  },
  bottom: {
    alignSelf: 'flex-end',
  },
});

class SuccessScreen extends Component {
  static navigationOptions = {
    title: "Success",
    ...headerStyle,
  };

  constructor() {
    super();

    this.restartApp = this.restartApp.bind(this);
  }

  componentDidMount() {
    this.props.disableButtonLoading();

    if (this._confettiView) {
      this._confettiView.startConfetti();
    }
  }

  componentWillUnmount ()   {
    if (this._confettiView) {
      this._confettiView.stopConfetti();
    }
  }

  computeLanguageLabel(language) {
    const lang = this.props.languages.find(({ code }) => code === language);
    if (!lang) {
      throw new Error(`Language ${language} is not found.`);
    }

    return lang.label;
  }

  setStorageAndRestart() {
    AsyncStorage
      .setItem('scanMore', 'true')
      .then(() => RNRestart.Restart());
  }

  restartApp() {
    this.props.enableButtonLoading()
      .then(this.setStorageAndRestart);
  }

  render() {
    return (
      <View style={styles.container}>
        <Confetti
          ref={(node) => this._confettiView = node}
          timeout={15}
          confettiCount={150}
        />
        <PrimaryText>
          Success!
        </PrimaryText>
        <Image source={require('./TickIcon.png')} style={styles.image} />
        <SecondaryText>
          <Text style={styles.bold}>{this.computeLanguageLabel(this.props.language)}</Text> translation{"\n"}
          will be sent to{"\n"}
          <Text style={styles.bold}>{this.props.email}</Text>{"\n"}
          in five minutes
        </SecondaryText>
        <RectangularButton
          accessibilityLabel="Continue scanning the paper mails"
          onPress={this.restartApp}
          style={styles.bottom}
          title="Scan more"
          loading={this.props.loading}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ application }) => ({
  loading: application.loading,
  language: application.language,
  languages: application.languages,
  translation: application.translation,
  email: application.email,
});

const mapDispatchToProps = dispatch => ({
  enableButtonLoading() {
    return dispatch(enableButtonLoading());
  },
  disableButtonLoading() {
    return dispatch(disableButtonLoading());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SuccessScreen);