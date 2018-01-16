import debounce from 'lodash.debounce';

export function debounceTaps(func) {
  return debounce(func, 300, { leading: true, trailing: false });
}
