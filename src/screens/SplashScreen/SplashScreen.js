import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button } from 'react-native';

import PrimaryText from '../../components/Texts/PrimaryText';
import SecondaryText from '../../components/Texts/SecondaryText';
import RectangularButton from '../../components/Buttons/RectangularButton';

export default class SplashScreen extends Component {
  static navigationOptions = {
    title: "Smail.rocks",
    headerStyle: {
      backgroundColor: '#50D2C2',
    },
  };

  constructor() {
    super();

    this.goToScan = this.goToScan.bind(this);
  }

  goToScan() {
    console.log('go to scan screen');
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <PrimaryText>
          Never miss{"\n"}
          what’s important
        </PrimaryText>
        <Image source={require('./SplashImage.png')} style={styles.image} />
        <SecondaryText>
          Send the translated{"\n"}
          version of a paper mail{"\n"}
          to your email
        </SecondaryText>
        <RectangularButton
          onPress={() => navigate('Scan')}
          title="Start"
          accessibilityLabel="Start scanning the paper mail"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 255,
    marginBottom: 35,
    marginTop: 35,
    width: 240,
  },
});
