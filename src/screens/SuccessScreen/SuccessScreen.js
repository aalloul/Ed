import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';

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

  computeLanguageLabel(language) {
    const lang = this.props.languages.find(({ code }) => code === language);
    if (!lang) {
      throw new Error(`Language ${language} is not found.`);
    }

    return lang.label;
  }

  render() {
    const { goToScan } = this.props;

    return (
      <View style={styles.container}>
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
          onPress={goToScan}
          style={styles.bottom}
          title="Scan more"
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    language: state.app.language,
    languages: state.app.languages,
    translation: state.app.translation,
    email: state.app.email,
  }),
  dispatch => ({
    goToScan() {
      return dispatch(NavigationActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'Home'}),
          NavigationActions.navigate({ routeName: 'Scan'}),
        ],
      }));
    }
  }),
)(SuccessScreen);