import { APP_START, SCREEN_START } from '../actions/statisticsActions';

const initialStatisticsState = {
  session_start: null,
  screen_start: null,
};

export default (state = initialStatisticsState, action) => {
  switch (action.type) {
    case APP_START: {
      return {
        ...state,
        session_start: action.payload,
      };
    }
    case SCREEN_START: {
      return {
        ...state,
        screen_start: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
