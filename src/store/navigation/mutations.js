export default {
  setPageTitle(state, { title }) {
    state.title = title;
  },

  setAppDrawerVisibility(state, { visible }) {
    state.appDrawerVisible = visible;
  },
};
