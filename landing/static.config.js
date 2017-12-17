export default {
  getSiteProps: () => ({
    title: 'Smail.rocks &mdash; the easiest way to handle paper letters in another language',
  }),
  getRoutes: async () => {
    return [
      {
        path: '/',
        component: 'src/containers/Home/Home',
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },
}
