import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export function genarateTranslationRequest(getState) {
  const { email, language, translation, photo } = getState().app;

  return {
    output: ['email'],
    email,
    input_language: "nl",
    output_language: language,
    human_translation_requested: translation === 'human',
    image: photo,
    timestamp: Date.now(),
    device: Platform.OS,
    version: 0.1,
    user_id: DeviceInfo.getUniqueID(),
    extract_reminder: false,
  };
}

export default {
  genarateTranslationRequest,
};
