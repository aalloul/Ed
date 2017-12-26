import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { appStart } from '../actions/statisticsActions';

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
  componentWillMount() {
    this.props.dispatchAppStart();
  }

  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({ dispatch, state: nav });

    return <AppNavigator navigation={navigation} />;
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dispatchAppStart: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav }) => ({ nav });

const mapDispatchToProps = (dispatch) => ({
  dispatchAppStart() {
    return dispatch(appStart());
  },
  dispatch() {
    return dispatch;
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState);
