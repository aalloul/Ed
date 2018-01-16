import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import storeUserDetails from '../middlewares/storeUserDetails';
import sendStatistics from '../middlewares/sendStatistics';
import actionsQueue from '../middlewares/actionsQueue';

import reducers from '../reducers';

const middlewares = [
  thunk,
  sendStatistics,
  storeUserDetails,
  actionsQueue,
];

// Connect our store to the reducers
export default createStore(reducers, applyMiddleware(...middlewares));
