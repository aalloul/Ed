export const headerStyle = {
  headerStyle: {
    backgroundColor: '#50D2C2',
  },
  headerTintColor: '#FFF',
};

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
