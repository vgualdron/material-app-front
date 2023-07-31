import types from './types';

export default {
  [types.mutations.SET_ZONES](state, payload) {
    state.zones = payload;
  },
  [types.mutations.SET_ZONE](state, payload) {
    state.zone = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
