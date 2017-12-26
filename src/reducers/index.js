import { combineReducers } from 'redux';

import app from './app';
import nav from './nav';
import statistics from './statistics';

export default combineReducers({
  app,
  nav,
  statistics,
});