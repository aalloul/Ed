import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'react-native-fetch-blob'
import { NavigationActions } from 'react-navigation';

export const TAKE_PHOTO_PROMISE = 'TAKE_PHOTO_PROMISE';
export const TAKE_PHOTO_RESOLVE = 'TAKE_PHOTO_RESOLVE';
export const TAKE_PHOTO_REJECT = 'TAKE_PHOTO_REJECT';

export const REQUEST_TRANSLATION_PROMISE = 'REQUEST_TRANSLATION_PROMISE';
export const REQUEST_TRANSLATION_RESOLVE = 'REQUEST_TRANSLATION_RESOLVE';
export const REQUEST_TRANSLATION_REJECT = 'REQUEST_TRANSLATION_REJECT';

export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const SELECT_TRANSLATION = 'SELECT_TRANSLATION';
export const CHANGE_EMAIL = 'CHANGE_EMAIL';

export const SEND_LETTER_PROMISE = 'SEND_LETTER_PROMISE';
export const SEND_LETTER_RESOLVE = 'SEND_LETTER_RESOLVE';
export const SEND_LETTER_REJECT = 'SEND_LETTER_REJECT';

function takePhotoPromise() {
  return {
    type: TAKE_PHOTO_PROMISE,
    loading: true,
  };
}

function takePhotoResolve(photo) {
  return {
    type: TAKE_PHOTO_RESOLVE,
    loading: false,
    photo,
  };
}

function takePhotoReject(err) {
  return {
    type: TAKE_PHOTO_REJECT,
    loading: false,
    err,
  };
}

export function takePhotoRoutine(camera) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(takePhotoPromise());

      camera
        .capture()
        .then((data) => {
          // @property {String} data.path: Returns the path of the captured image or video file on disk
          console.log(data);

          return RNFetchBlob.fs.readStream(data.path, 'base64');
        })
        .then((ifstream) => {
          let buffer = '';

          ifstream.open();
          ifstream.onData(chunk => buffer += chunk);
          ifstream.onError((err) => {
            throw err;
          });
          ifstream.onEnd(() => {
            dispatch(takePhotoResolve(buffer));
            dispatch(NavigationActions.navigate({ routeName: 'Translation' }));

            resolve(buffer);
          })
        })
        .catch(err => {
          dispatch(takePhotoReject(err));

          console.error(err);

          reject(err);
        });
    });
  };
}

function requestTranslationPromise() {
  return {
    type: REQUEST_TRANSLATION_PROMISE,
  };
}

function requestTranslationResolve() {
  return {
    type: REQUEST_TRANSLATION_RESOLVE,
  };
}

function requestTranslationReject() {
  return {
    type: REQUEST_TRANSLATION_REJECT,
  };
}

export function requestTranslationRoutine() {
  return (dispatch, getState) => {
    const { email, language, translation, photo } = getState().app;

    dispatch(requestTranslationPromise());

    fetch('https://linear-asset-184705.appspot.com/request_translation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        output: ['email'],
        email,
        input_language: "nl",
        output_language: language,
        human_translation_requested: translation === 'human',
        image: photo,
        timestamp: Date.now(),
        device: Platform.OS === 'ios' ? 'ios' : 'android',
        version: 0.1,
        user_id: DeviceInfo.getUniqueID(),
        extract_reminder: false,
      }),
    })
      .then(response => {
        console.log('response', response);
        return response.json();
      })
      .then(response => {
        console.log('response', response);
        dispatch(requestTranslationResolve(response));
        dispatch(NavigationActions.navigate({ routeName: 'Success' }));
      })
      .catch(err => {
        // todo:pavlik check the error here
        dispatch(requestTranslationReject(err));

        console.error(err);
      });
  };
}

export function changeLanguage(language) {
  return {
    type: CHANGE_LANGUAGE,
    language,
  };
}

export function selectTranslation(translation) {
  return (dispatch) => {
    dispatch({
      type: SELECT_TRANSLATION,
      translation,
    });

    dispatch(NavigationActions.navigate({ routeName: 'Email' }));
  };
}

export function changeEmail(email) {
  return {
    type: CHANGE_EMAIL,
    email,
  };
}