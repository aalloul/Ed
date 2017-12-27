import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, View, Image, Text } from 'react-native';
import RNRestart from 'react-native-restart';
import Confetti from 'react-native-confetti';

import PrimaryText from '../../components/Texts/PrimaryText';
import SecondaryText from '../../components/Texts/SecondaryText';
import RectangularButton from '../../components/Buttons/RectangularButton';

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
    headerStyle: {
      backgroundColor: '#50D2C2',
    },
  };

  constructor() {
    super();

    this.restartApp = this.restartApp.bind(this);
  }

  componentDidMount() {
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

  restartApp() {
    AsyncStorage
      .setItem('scanMore', 'true')
      .then(() => RNRestart.Restart());
  }

  render() {
    return (
      <View style={styles.container}>
        <Confetti ref={(node) => this._confettiView = node}/>
        <PrimaryText>
          Success!
        </PrimaryText>
        <Image source={require('./TickIcon.png')} style={styles.image} />
        <SecondaryText>
          <Text style={styles.bold}>{this.computeLanguageLabel(this.props.language)}</Text> translation{"\n"}
          has been sent to{"\n"}
          <Text style={styles.bold}>{this.props.email}</Text>
        </SecondaryText>
        <RectangularButton
          accessibilityLabel="Continue scanning the paper mails"
          onPress={this.restartApp}
          style={styles.bottom}
          title="Scan more"
        />
      </View>
    );
  }
}

export default connect(
  ({ app }) => ({
    language: app.language,
    languages: app.languages,
    translation: app.translation,
    email: app.email,
  })
)(SuccessScreen);