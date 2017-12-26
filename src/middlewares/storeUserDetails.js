import { AsyncStorage } from 'react-native';
import { REQUEST_TRANSLATION_PROMISE, TAKE_PHOTO_PROMISE } from '../actions/appActions';

export default function storeUserDetails({ getState, dispatch }) {
  return next => async (action) => {
    const { language, email } = getState().app;

    if (action.type === REQUEST_TRANSLATION_PROMISE) {
      try {
        await AsyncStorage.setItem('userDetails', JSON.stringify({ language, email }));
        const storedItem = await AsyncStorage.getItem('userDetails');
        console.log('storedItem', JSON.parse(storedItem));
      } catch (e) {
        console.error('error storing userDetails', e);
      }
    }

    if (action.type === TAKE_PHOTO_PROMISE) {
      const userDetails = await AsyncStorage.getItem('userDetails');

      try {
        if (userDetails) {
          const parserUserDetails = JSON.parse(userDetails);

          dispatch({
            type: 'LOAD_STORED_USER_STATE',
            ...parserUserDetails,
          });

          console.log('parsed', parserUserDetails);
        }
      } catch (e) {
        console.error('error loading userDetails', e);
      }
    }

    return next(action);
  }
}
