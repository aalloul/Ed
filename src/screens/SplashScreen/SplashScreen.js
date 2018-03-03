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
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  imageWrapper: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    flex: 1
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
    this.props.goToScan();
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
        <View style={styles.imageWrapper}>
          <Image source={require('./SplashImage.png')} style={styles.image} resizeMode="contain" />
        </View>

        <SecondaryText>
          Send the translated{"\n"}
          version of a physical mail{"\n"}
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
