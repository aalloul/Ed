export const APP_START = 'APP_START';
export const APP_END = 'APP_END';

export function appStart() {
  return {
    type: APP_START,
    payload: Date.now(),
  };
}

export function appEnd() {
  return {
    type: APP_END,
    payload: Date.now(),
  };
}
