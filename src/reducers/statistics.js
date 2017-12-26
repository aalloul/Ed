import { REQUEST_TRANSLATION_RESOLVE } from '../actions/appActions';
import { APP_START, APP_END } from '../actions/statisticsActions';

const initialStatisticsState = {
  session_start: null,
};

export default (state = initialStatisticsState, action) => {
  switch (action.type) {
    case APP_START: {
      return {
        ...state,
        session_start: Date.now(),
      };
    }
    default: {
      return state;
    }
  }
};
