import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import store from './src/app/store';

import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import ScanScreen from './src/screens/ScanScreen/ScanScreen';
import TranslationScreen from './src/screens/TranslationScreen/TranslationScreen';
import EmailScreen from './src/screens/EmailScreen/EmailScreen';
import SuccessScreen from './src/screens/SuccessScreen/SuccessScreen';

const AppNavigator = StackNavigator({
  Home: { screen: SplashScreen },
  Scan: { screen: ScanScreen },
  Translation: { screen: TranslationScreen },
  Email: { screen: EmailScreen },
  Success: { screen: SuccessScreen },
});

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}

