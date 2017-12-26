import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { APP_END } from '../actions/statisticsActions';

export function generateTranslationRequest(getState) {
  const { email, language, translation, photo } = getState().app;

  return {
    output: ['email'],
    email,
    input_language: 'nl',
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

export function generateStatisticsRequest(getState, action) {
  const { session_start, session_end, session_duration, number_scans } = getState().statistics;
  console.log('getState.nav', getState().nav);

  let dataModel = {
    datamodel_version: 0.1,
    app_version: 0.2,
    phone_maker: DeviceInfo.getManufacturer(),
    phone_model: DeviceInfo.getModel(),
    os_version: DeviceInfo.getSystemVersion(),
    user_id: DeviceInfo.getUniqueID(),
    timestamp: Date.now(),
    type: 'data',
    screen: 'send_document',
    action: action.type,
    screen_start: 1510556217358,
    screen_end: 1510556219358,
    session_start,
  };

  if (action.type === APP_END) {
    dataModel = {
      ...dataModel,
      session_end,
      session_duration,
      number_scans,
    };
  }

  console.log('data model', dataModel);

  return dataModel;
}

export default {
  generateTranslationRequest,
  generateStatisticsRequest,
};
