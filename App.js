import React from 'react';
import { StackNavigator } from 'react-navigation';

import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import ScanScreen from './src/screens/ScanScreen/ScanScreen';
import TranslationScreen from './src/screens/TranslationScreen/TranslationScreen';
import EmailScreen from './src/screens/EmailScreen/EmailScreen';
import SuccessScreen from './src/screens/SuccessScreen/SuccessScreen';

export default StackNavigator({
  Home: { screen: SplashScreen },
  Scan: { screen: ScanScreen },
  Translation: { screen: TranslationScreen },
  Email: { screen: EmailScreen },
  Success: { screen: SuccessScreen },
});
