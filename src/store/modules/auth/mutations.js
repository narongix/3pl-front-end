export default {
    setUser(state, payload) {
      state.user = payload.user;
      state.isLoggedIn = payload.isLoggedIn;
    }
  };