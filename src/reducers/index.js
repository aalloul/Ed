export default (state = {
  photo: null,
  language: 'en',
  languages: [
    { label: 'English', code: 'en' },
    { label: 'Dutch / Nederlands', code: 'nl' },
    { label: 'French / Français', code: 'fr' },
    { label: 'Spanish / Español', code: 'es' },
    { label: 'Russian / Русский', code: 'ru' },
  ],
  email: '',
  translation: null,
}, action) => Object.assign({}, state, action);