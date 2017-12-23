import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image } from 'react-native';

import PrimaryText from '../../components/Texts/PrimaryText';
import SecondaryText from '../../components/Texts/SecondaryText';
import RectangularButton from '../../components/Buttons/RectangularButton';
import { goToScan } from '../../actions/index';

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

class SplashScreen extends Component {
  static navigationOptions = {
    title: "Smail.rocks",
    headerStyle: {
      backgroundColor: '#50D2C2',
    },
  };

  render() {
    const { goToScan } = this.props;

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
          onPress={goToScan}
          title="Start"
          accessibilityLabel="Start scanning the paper mail"
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  goToScan() {
    return dispatch(goToScan());
  },
});

export default connect(null, mapDispatchToProps)(SplashScreen);
