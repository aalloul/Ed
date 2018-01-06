import { generateBasicStatisticsRequest, getCurrentRouteName } from '../common/requestDataHelpers';
import { SCREEN_START, screenStart } from '../actions/statisticsActions';

function sendStatisticsRequest(statisticsRequest) {
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

    let statisticsRequest = generateBasicStatisticsRequest(getState, action, dispatch);

    const currentScreen = getCurrentRouteName(getState().navigation);
    const result = next(action);
    const nextScreen = getCurrentRouteName(getState().navigation);

    statisticsRequest.screen = currentScreen;

    if (nextScreen !== currentScreen) {
      statisticsRequest.screen_end = Date.now();

      console.log('statisticsRequest before changing route', statisticsRequest);
      sendStatisticsRequest(statisticsRequest);

      // remove screen_end from statisticsRequest in functional way
      const { screen_end, ...cleanStatisticsRequest } = statisticsRequest;

      cleanStatisticsRequest.screen_start = Date.now();
      cleanStatisticsRequest.screen = nextScreen;
      dispatch(screenStart(cleanStatisticsRequest.screen_start));

      statisticsRequest = cleanStatisticsRequest;
    }

    console.log('statisticsRequest', statisticsRequest);
    sendStatisticsRequest(statisticsRequest);

    return result;
  }
}