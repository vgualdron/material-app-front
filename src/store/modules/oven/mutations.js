import types from './types';

export default {
  [types.mutations.SET_OVENS](state, payload) {
    state.ovens = payload;
  },
  [types.mutations.SET_OVEN](state, payload) {
    state.oven = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
