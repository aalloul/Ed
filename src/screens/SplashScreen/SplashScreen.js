import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, View, Image } from 'react-native';

import PrimaryText from '../../components/Texts/PrimaryText';
import SecondaryText from '../../components/Texts/SecondaryText';
import RectangularButton from '../../components/Buttons/RectangularButton';
import { disableButtonLoading, enableButtonLoading, goToScan } from '../../actions/applicationActions';

import { headerStyle } from '../../common/navigationOptions';
import Preloader from '../../components/Preloader/Preloader';

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
    ...headerStyle,
  };

  constructor() {
    super();

    this.scanMore = this.scanMore.bind(this);
    this.onPressHandler = this.onPressHandler.bind(this);
  }

  componentWillMount() {
    AsyncStorage
      .getItem('scanMore')
      .then((value) => value === 'true' ? this.scanMore() : Promise.resolve())
      .then(this.props.disableButtonLoading);
  }

  componentDidMount() {
    console.log('SplashScreen mounted');
  }

  componentWillUnmount() {
    console.log('SplashScreen unmounted');
  }

  onPressHandler() {
    // setTimeout is needed because of instantly starting loading
    // the Camera so the Preloader couldn't be in time
    this.props.enableButtonLoading()
      .then(() => setTimeout(this.props.goToScan, 200));
  }

  scanMore() {
    return AsyncStorage
      .setItem('scanMore', 'false')
      .then(() => this.props.goToScan());
  }

  render() {
    if (this.props.loading) {
      return <Preloader />;
    }

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
          onPress={this.onPressHandler}
          title="Start"
          accessibilityLabel="Start scanning the paper mail"
        />
      </View>
    );
  }
}

const mapStateToProps = ({ application: { loading } }) => ({ loading });

const mapDispatchToProps = dispatch => ({
  goToScan() {
    return dispatch(goToScan());
  },
  enableButtonLoading() {
    return dispatch(enableButtonLoading());
  },
  disableButtonLoading() {
    return dispatch(disableButtonLoading());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
