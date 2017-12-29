import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { APP_START, screenStart } from '../actions/statisticsActions';

export function generateTranslationRequest(getState) {
  const { email, language, translation, photo } = getState().application;

  return {
    output: ['email', 'app'],
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

export function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

export function generateBasicStatisticsRequest(getState, action, dispatch) {
  // fix first time setting of the sessionStart
  const sessionStart = action.type === APP_START && !getState().statistics.session_start
    ? action.payload
    : getState().statistics.session_start;

  const dataModel = {
    datamodel_version: 0.1,
    app_version: 0.2,
    phone_maker: DeviceInfo.getManufacturer(),
    phone_model: DeviceInfo.getModel(),
    os_version: DeviceInfo.getSystemVersion(),
    user_id: DeviceInfo.getUniqueID(),
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
  getCurrentRouteName,
  generateBasicStatisticsRequest,
};
