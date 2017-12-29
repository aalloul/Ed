export const APP_START = 'APP_START';
export const SCREEN_START = 'SCREEN_START';

export function appStart() {
  return {
    type: APP_START,
    payload: Date.now(),
  };
}

export function screenStart(time) {
  return {
    type: SCREEN_START,
    payload: time,
  };
}
