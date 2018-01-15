import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';
import {
  REQUEST_TRANSLATION_PROMISE,
  SELECT_TRANSLATION,
  TAKE_PHOTO_PROMISE,
  GO_TO_SCAN,
} from '../actions/applicationActions';

const initialNavState = AppNavigator.router.getStateForAction(NavigationActions.init());

export default (state = initialNavState, action) => {
  let nextState;

  switch (action.type) {
    case GO_TO_SCAN: {
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Scan' }),
        state,
      );
      break;
    }
    case TAKE_PHOTO_PROMISE: {
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Translation' }),
        state,
      );
      break;
    }
    case SELECT_TRANSLATION: {
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Email' }),
        state,
      );
      break;
    }
    case REQUEST_TRANSLATION_PROMISE: {
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Success' }),
        state,
      );
      break;
    }
    default: {
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
    }
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
