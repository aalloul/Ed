import { AsyncStorage } from 'react-native';
import {
  LOAD_STORED_USER_STATE,
  REQUEST_TRANSLATION_RESOLVE,
} from '../actions/applicationActions';
import { APP_START } from '../actions/statisticsActions';

// TODO This middleware make actions slower so they can't work properly in async mode
// TODO (there is a problem with setting navigation screens to redux store and thus tracking Screen to GA)
// TODO now dealed by executing these middleware functions only on non important actions
// TODO Think about dealing with it in the future
export default function storeUserDetails({ getState, dispatch }) {
  return next => async (action) => {
    const { language, email } = getState().application;

    if (action.type === REQUEST_TRANSLATION_RESOLVE) {
      try {
        await AsyncStorage.setItem('userDetails', JSON.stringify({ language, email }));
        const storedItem = await AsyncStorage.getItem('userDetails');
        console.log('storedItem', JSON.parse(storedItem));
      } catch (e) {
        console.error('error storing userDetails', e);
      }
    }

    if (action.type === APP_START) {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');

        if (userDetails) {
          const parsedUserDetails = JSON.parse(userDetails);

          dispatch({
            type: LOAD_STORED_USER_STATE,
            ...parsedUserDetails,
          });

          console.log('parsed', parsedUserDetails);
        }
      } catch (e) {
        console.error('error loading userDetails', e);
      }
    }

    console.log('state', getState());

    return next(action);
  }
}
