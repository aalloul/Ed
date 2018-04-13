import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, View, Image, Text } from 'react-native';
import RNRestart from 'react-native-restart';
import Confetti from 'react-native-confetti';

import PrimaryText from '../../components/Texts/PrimaryText';
import SecondaryText from '../../components/Texts/SecondaryText';
import RectangularButton from '../../components/Buttons/RectangularButton';
import { ShareDialog } from 'react-native-fbsdk';

import { headerStyle } from '../../common/navigationHelpers';

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  buttonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  image: {
    height: 115,
    marginBottom: 35,
    marginTop: 35,
    width: 150,
  },
});

class SuccessScreen extends PureComponent {
  static navigationOptions = {
    title: "Success",
    ...headerStyle,
  };

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

  setStorageAndRestart() {
    AsyncStorage
      .setItem('scanMore', 'true')
      .then(() => RNRestart.Restart());
  }

  shareTheHearts() {
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: "https://www.smail.rocks",
      message: 'I found a cool app. It translates physical mails and converts them into emails. Definitely must-have for those who live abroad!',
    };

    ShareDialog
      .canShow(shareLinkContent)
      .then((canShow) => canShow && ShareDialog.show(shareLinkContent))
      .then((result) => {
        if (result.isCancelled) {
          console.log('Share operation was cancelled');
        } else {
          console.log('Share was successful with postId');
        }
      },
      (error) => {
        console.log('Share failed with error: ' + error.message);
      });
  }

  render() {
    const { email, language } = this.props;

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
          <Text style={styles.bold}>{this.computeLanguageLabel(language)}</Text> translation{"\n"}
          is sent to{"\n"}
          <Text style={styles.bold}>{email}</Text>{"\n"}
        </SecondaryText>
        <View style={styles.buttonsWrapper}>
          <RectangularButton
            accessibilityLabel="Continue scanning the paper mails"
            onPress={this.setStorageAndRestart}
            title="Scan more"
          />
          <RectangularButton
            accessibilityLabel="Share your &hearts; with your friends"
            onPress={this.shareTheHearts}
            title="Share the &hearts;"
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ application }) => ({
  language: application.language,
  languages: application.languages,
  translation: application.translation,
  email: application.email,
});

export default connect(mapStateToProps)(SuccessScreen);