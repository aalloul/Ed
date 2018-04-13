import { generateBasicStatisticsRequest } from '../common/requestDataHelpers';
import { APP_START, SCREEN_START, screenStart } from '../actions/statisticsActions';
import { getCurrentRouteName } from '../common/navigationHelpers';
import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from "react-native-google-analytics-bridge";

GoogleAnalyticsSettings.setDispatchInterval(3);

const tracker = new GoogleAnalyticsTracker('UA-93678494-4');

function sendStatisticsRequest(statisticsRequest) {
  console.log('statisticsRequest', statisticsRequest);

  return fetch('https://reporting-dot-linear-asset-184705.appspot.com/events', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statisticsRequest),
  })
    .then(response => {
      console.log('Pure statistics response', response);
      return response.json();
    })
    .then(response => {
      console.log('Statistic has been sent successfully', response);
    })
    .catch(err => console.error('An error has occurred', err));
}

export default function sendStatistics({ getState, dispatch }) {
  return next => (action) => {
    if (action.type === SCREEN_START) {
      return next(action);
    }

    const statisticsRequest = generateBasicStatisticsRequest(getState, action, dispatch);

    const currentScreen = getCurrentRouteName(getState().navigation);
    const result = next(action);
    const nextScreen = getCurrentRouteName(getState().navigation);

    // for now the only way we can catch app starting the APP_START action
    // so we use it to send the Home screen to GA
    if (action.type === APP_START) {
      tracker.trackScreenView(currentScreen);
    }

    statisticsRequest.screen = currentScreen;

    if (nextScreen !== currentScreen) {
      // avoid queue actions because they keeps old screen
      if (!action.queue) {
        tracker.trackScreenView(nextScreen);
      }

      // send statistics about the current screen
      // current - the one that was before the action of transition to the new(next) screen
      // it's done, to be able to send "screen_end" time
      sendStatisticsRequest({
        ...statisticsRequest,
        screen_end: Date.now()
      });

      statisticsRequest.screen_start = Date.now();
      statisticsRequest.screen = nextScreen;

      dispatch(screenStart(statisticsRequest.screen_start));
    }

    // now send statistics about the new(next) screen
    sendStatisticsRequest(statisticsRequest);

    return result;
  }
}
