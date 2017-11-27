export const TAKE_PHOTO = 'TAKE_PHOTO';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const SELECT_TRANSLATION = 'SELECT_TRANSLATION';
export const CHANGE_EMAIL = 'CHANGE_EMAIL';
export const SEND_LETTER = 'CHANGE_EMAIL';

// todo:pavlik store information about the User locally (to phone database)

export function takePhoto(photo) {
  return {
    type: TAKE_PHOTO,
    photo,
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
    type: TAKE_PHOTO,
    translation,
  };
}

export function changeEmail(email) {
  return {
    type: CHANGE_EMAIL,
    email,
  };
}

export function sendLetter() {
  return {
    type: SEND_LETTER,
  };
}
