import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';
import {
  REQUEST_TRANSLATION_RESOLVE,
  SELECT_TRANSLATION,
  TAKE_PHOTO_PROMISE,
  GO_TO_SCAN,
} from '../actions/applicationActions';

const initialNavState = AppNavigator.router.getStateForAction(NavigationActions.init());

export default (state = initialNavState, action) => {
  let navigatorAction;

  switch (action.type) {
    case GO_TO_SCAN: {
      navigatorAction = NavigationActions.navigate({ routeName: 'Scan' });
      break;
    }
    case TAKE_PHOTO_PROMISE: {
      navigatorAction = NavigationActions.navigate({ routeName: 'Translation' });
      break;
    }
    case SELECT_TRANSLATION: {
      navigatorAction = NavigationActions.navigate({ routeName: 'Email' });
      break;
    }
    case REQUEST_TRANSLATION_RESOLVE: {
      navigatorAction = NavigationActions.navigate({ routeName: 'Success' });
      break;
    }
    default: {
      navigatorAction = action;
      break;
    }
  }

  const nextState = AppNavigator.router.getStateForAction(navigatorAction, state);

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
