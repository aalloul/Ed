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
  loading: false,
};

export default (state = initialAppState, action) => Object.assign({}, state, action);
