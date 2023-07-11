import types from './types';

export default {
  [types.mutations.SET_RATES](state, payload) {
    state.rates = payload;
  },
  [types.mutations.SET_RATE](state, payload) {
    state.rate = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
