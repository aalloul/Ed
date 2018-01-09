import RNFetchBlob from 'react-native-fetch-blob';

import { generateTranslationRequest } from '../common/requestDataHelpers';

const MAIN_FLOW_QUEUE = 'MAIN_FLOW_QUEUE';

export const GO_TO_SCAN = 'GO_TO_SCAN';

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

export const RESTART_APP = 'RESTART_APP';

export function goToScan() {
  return {
    type: GO_TO_SCAN,
  };
}

function takePhotoPromise() {
  return {
    type: TAKE_PHOTO_PROMISE,
    loading: true,
  };
}

function takePhotoResolve(photo) {
  console.log('photo TAKE_PHOTO_RESOLVE', photo);
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
  return {
    queue: MAIN_FLOW_QUEUE,
    callback: (next, dispatch, getState) => {
      dispatch(takePhotoPromise());

      camera
        .capture()
        .then((data) => {
          // @property {String} data.path: Returns the path of the captured image or video file on disk
          console.log('all data', data);

          return RNFetchBlob.fs.readStream(data.path, 'base64', 4095);
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
            next();
          });
        })
        .catch(err => {
          dispatch(takePhotoReject(err));
          console.error(err);
          next();
        });
    },
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
  return {
    queue: MAIN_FLOW_QUEUE,
    callback: (next, dispatch, getState) => {
      const translationRequest = generateTranslationRequest(getState);

      console.log('translationRequest', translationRequest);

      dispatch(requestTranslationPromise());

      fetch('https://linear-asset-184705.appspot.com/request_translation', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translationRequest),
      })
        .then(response => {
          console.log('Pure response', response);
          return response.json();
        })
        .then(response => {
          console.log('JSON.parsed response', response);
          dispatch(requestTranslationResolve(response));
          next();
        })
        .catch(err => {
          dispatch(requestTranslationReject(err));

          console.error(err);
          next();
        });
    },
  };
}

export function changeLanguage(language) {
  return {
    type: CHANGE_LANGUAGE,
    language,
  };
}

export function selectTranslation(translation) {
  return {
      type: SELECT_TRANSLATION,
      translation,
    };
}

export function changeEmail(email) {
  return {
    type: CHANGE_EMAIL,
    email,
  };
}
