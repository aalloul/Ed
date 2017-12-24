import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './src/app/store';

import AppNavigator from './src/navigators/AppNavigator';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}

