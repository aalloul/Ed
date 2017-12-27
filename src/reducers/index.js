import { combineReducers } from 'redux';

import application from './application';
import navigation from './navigation';
import statistics from './statistics';

export default combineReducers({
  application,
  navigation,
  statistics,
});