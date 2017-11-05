import React from 'react';
import { StyleSheet, View, Image, Text, Button } from 'react-native';

export default class SplashScreen extends React.Component {
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
        <Text style={styles.heroText}>Never miss{"\n"}what’s important</Text>
        <Image source={require('./SplashImage.png')} style={styles.image} />
        <Text style={styles.bottomText}>Send the translated{"\n"}version of a paper mail{"\n"}to your email</Text>
        <Button
          onPress={() => navigate('Scan')}
          title="Start"
          color="#50D2C2"
          style={styles.button}
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
  text: {
    color: '#999',
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
  heroText: {
    color: '#999',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 32,
  },
  bottomText: {
    color: '#999',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 24,
  },
  image: {
    height: 255,
    marginBottom: 35,
    marginTop: 35,
    width: 240,
  },
});
