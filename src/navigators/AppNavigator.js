import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppState } from 'react-native';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { appStart, appEnd } from '../actions/statisticsActions';

import SplashScreen from '../screens/SplashScreen/SplashScreen';
import ScanScreen from '../screens/ScanScreen/ScanScreen';
import TranslationScreen from '../screens/TranslationScreen/TranslationScreen';
import EmailScreen from '../screens/EmailScreen/EmailScreen';
import SuccessScreen from '../screens/SuccessScreen/SuccessScreen';

export const AppNavigator = StackNavigator({
  Home: { screen: SplashScreen },
  Scan: { screen: ScanScreen },
  Translation: { screen: TranslationScreen },
  Email: { screen: EmailScreen },
  Success: { screen: SuccessScreen },
});

class AppWithNavigationState extends Component {
  componentDidMount() {
    console.log('AppWithNavigationState mounted');
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    console.log('AppWithNavigationState unmounted');
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    console.log('AppState.currentState', AppState.currentState);
    console.log('nextAppState', nextAppState);

    if (AppState.currentState.match(/inactive|background/) && nextAppState === 'active') {
      this.props.dispatchAppStart();
    }

    if (AppState.currentState.match(/active|background/) && nextAppState === 'inactive') {
      this.props.dispatchAppEnd();
    }
  };

  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({ dispatch, state: nav });

    return <AppNavigator navigation={navigation} />;
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dispatchAppStart: PropTypes.func.isRequired,
  dispatchAppEnd: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav }) => ({ nav });

const mapDispatchToProps = (dispatch) => ({
  dispatchAppStart() {
    return dispatch(appStart());
  },
  dispatchAppEnd() {
    return dispatch(appEnd());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState);
