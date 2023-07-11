import types from './types';

export default {
  [types.mutations.SET_ADJUSTMENTS](state, payload) {
    state.adjustments = payload;
  },
  [types.mutations.SET_ADJUSTMENT](state, payload) {
    state.adjustment = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
