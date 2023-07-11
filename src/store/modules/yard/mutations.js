import types from './types';

export default {
  [types.mutations.SET_YARDS](state, payload) {
    state.yards = payload;
  },
  [types.mutations.SET_YARD](state, payload) {
    state.yard = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
