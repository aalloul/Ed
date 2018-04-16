import { generateTranslationRequest } from '../common/requestDataHelpers';
import { ShareDialog } from 'react-native-fbsdk';

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
export const LOAD_STORED_USER_STATE = 'LOAD_STORED_USER_STATE';

export const SHARE_DIALOG_PROMISE = 'SHARE_DIALOG_PROMISE';
export const SHARE_DIALOG_RESOLVE = 'SHARE_DIALOG_RESOLVE';
export const SHARE_DIALOG_REJECT = 'SHARE_DIALOG_REJECT';

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
  };
}

function takePhotoResolve(photo) {
  return {
    type: TAKE_PHOTO_RESOLVE,
    photo,
  };
}

function takePhotoReject(err) {
  return {
    type: TAKE_PHOTO_REJECT,
    err,
  };
}

export function takePhotoRoutine(camera) {
  return {
    queue: MAIN_FLOW_QUEUE,
    callback: (next, dispatch) => {
      dispatch(takePhotoPromise());

      const options = { base64: true };

      return camera
        .takePictureAsync(options)
        .then((data) => {
          dispatch(takePhotoResolve(data.base64));
          next();
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
      dispatch(requestTranslationPromise());

      const translationRequest = generateTranslationRequest(getState);

      console.log('translationRequest', translationRequest);

      return fetch('https://linear-asset-184705.appspot.com/request_translation', {
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

export function openShareDialogRoutine() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: SHARE_DIALOG_PROMISE });

      const shareLinkContent = {
        contentType: 'link',
        contentUrl: "https://www.smail.rocks",
      };

      ShareDialog
        .canShow(shareLinkContent)
        .then((canShow) => canShow && ShareDialog.show(shareLinkContent))
        .then((result) => {
            if (result.isCancelled) {
              dispatch({ type: SHARE_DIALOG_REJECT });
              reject();
            } else {
              dispatch({ type: SHARE_DIALOG_RESOLVE });
              resolve();
            }
          },
          (error) => {
            console.log('Share failed with error: ' + error.message);
            dispatch({ type: SHARE_DIALOG_REJECT });
            reject();
          });
    });
  };
}
