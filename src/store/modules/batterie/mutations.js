import types from './types';

export default {
  [types.mutations.SET_BATTERIES](state, payload) {
    state.batteries = payload;
  },
  [types.mutations.SET_BATTERIE](state, payload) {
    state.batterie = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
