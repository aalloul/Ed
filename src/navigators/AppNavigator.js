import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

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

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav }) => ({ nav });

export default connect(mapStateToProps)(AppWithNavigationState);
