import { AsyncStorage } from 'react-native';
import {
  LOAD_STORED_USER_STATE,
  REQUEST_TRANSLATION_PROMISE,
  GO_TO_SCAN,
} from '../actions/applicationActions';

export default function storeUserDetails({ getState, dispatch }) {
  return next => async (action) => {
    const { language, email } = getState().application;

    if (action.type === REQUEST_TRANSLATION_PROMISE) {
      try {
        await AsyncStorage.setItem('userDetails', JSON.stringify({ language, email }));
        const storedItem = await AsyncStorage.getItem('userDetails');
        console.log('storedItem', JSON.parse(storedItem));
      } catch (e) {
        console.error('error storing userDetails', e);
      }
    }

    if (action.type === GO_TO_SCAN) {
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
