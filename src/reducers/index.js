import { combineReducers } from 'redux';

import app from './app';
import nav from './nav';

export default combineReducers({
  nav,
  app,
});