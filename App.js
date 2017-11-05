import React from 'react';
import { StackNavigator } from 'react-navigation';

import SplashScreen from './src/SplashScreen/SplashScreen';
import ScanScreen from './src/ScanScreen/ScanScreen';

export default StackNavigator({
  Home: { screen: SplashScreen },
  Scan: { screen: ScanScreen },
});
