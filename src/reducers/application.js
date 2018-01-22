import {
  TAKE_PHOTO_RESOLVE,
  CHANGE_LANGUAGE,
  SELECT_TRANSLATION,
  CHANGE_EMAIL,
  LOAD_STORED_USER_STATE,
} from '../actions/applicationActions';

const initialAppState = {
  email: '',
  language: 'en',
  languages: [
    { label: 'English', code: 'en' },
    { label: 'Dutch / Nederlands', code: 'nl' },
    { label: 'French / Français', code: 'fr' },
    { label: 'Spanish / Español', code: 'es' },
    { label: 'Russian / Русский', code: 'ru' },
  ],
  photo: null,
  translation: null,
};

export default (state = initialAppState, action) => {
  switch (action.type) {
    case LOAD_STORED_USER_STATE:
      return {
        ...state,
        language: action.language,
        email: action.email,
      };
    case TAKE_PHOTO_RESOLVE:
      return {
        ...state,
        photo: action.photo,
      };
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    case SELECT_TRANSLATION:
      return {
        ...state,
        translation: action.translation,
      };
    case CHANGE_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    default:
      return state;
  }
};
