import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, View, Image } from 'react-native';

import PrimaryText from '../../components/Texts/PrimaryText';
import SecondaryText from '../../components/Texts/SecondaryText';
import RectangularButton from '../../components/Buttons/RectangularButton';
import { goToScan } from '../../actions/applicationActions';

import { debounceTaps } from '../../common/commonHelpers';
import { headerStyle } from '../../common/navigationHelpers';

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

class SplashScreen extends PureComponent {
  static navigationOptions = {
    title: "Smail.rocks",
    ...headerStyle,
  };

  constructor() {
    super();

    this.state = {
      loading: true,
    };

    this.disableLoading = this.disableLoading.bind(this);
    this.scanMore = this.scanMore.bind(this);
    this.handlePress = debounceTaps(this.handlePress.bind(this));
  }

  componentWillMount() {
    AsyncStorage
      .getItem('scanMore')
      .then((value) => value === 'true' ? this.scanMore() : Promise.resolve())
      .then(this.disableLoading);
  }

  disableLoading() {
    this.setState({ loading: false });
  }

  handlePress() {
    this.setState(
      { loading: true },
      // setTimeout is needed because of instantly starting
      // loading the Camera the Preloader couldn't be in time
      () => setTimeout(
        () => this.props.goToScan().then(this.disableLoading),
        150
      ));
  }

  scanMore() {
    return AsyncStorage
      .setItem('scanMore', 'false')
      .then(this.props.goToScan);
  }

  render() {
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
          onPress={this.handlePress}
          title="Start"
          loading={this.state.loading}
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
