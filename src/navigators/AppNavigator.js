import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import SplashScreen from '../../src/screens/SplashScreen/SplashScreen';
import ScanScreen from '../../src/screens/ScanScreen/ScanScreen';
import TranslationScreen from '../../src/screens/TranslationScreen/TranslationScreen';
import EmailScreen from '../../src/screens/EmailScreen/EmailScreen';
import SuccessScreen from '../../src/screens/SuccessScreen/SuccessScreen';

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

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
