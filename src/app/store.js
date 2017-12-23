import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import storeUserDetails from '../middlewares/storeUserDetails';
import reducers from '../reducers';

// Connect our store to the reducers
export default createStore(reducers, applyMiddleware(thunk, storeUserDetails));
