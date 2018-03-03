import { Platform } from 'react-native';
import { getManufacturer, getModel, getSystemVersion, getUniqueID } from 'react-native-device-info';
import { APP_START, screenStart } from '../actions/statisticsActions';

const DEBUG = false;

export function generateTranslationRequest(getState) {
  const { email, language, translation, photo } = getState().application;

  return {
    output: ['email', 'app'],
    email,
    debug: DEBUG,
    output_language: language,
    human_translation_requested: translation === 'human',
    image: photo,
    timestamp: Date.now(),
    device: Platform.OS,
    version: 0.2,
    user_id: getUniqueID(),
    extract_reminder: false,
  };
}

export function generateBasicStatisticsRequest(getState, action, dispatch) {
  // fix first time setting of the sessionStart
  const sessionStart = action.type === APP_START && !getState().statistics.session_start
    ? action.payload
    : getState().statistics.session_start;

  const dataModel = {
    datamodel_version: 0.2,
    app_version: 0.2,
    debug: DEBUG,
    phone_maker: getManufacturer(),
    phone_model: getModel(),
    os_version: getSystemVersion(),
    user_id: getUniqueID(),
    timestamp: Date.now(),
    type: 'data',
    action: action.type,
    session_start: sessionStart,
    screen_start: getState().statistics.screen_start,
  };

  if (action.type === APP_START) {
    dataModel.screen_start = sessionStart;
    dispatch(screenStart(sessionStart));
  }

  return dataModel;
}

export default {
  generateTranslationRequest,
  generateBasicStatisticsRequest,
};
