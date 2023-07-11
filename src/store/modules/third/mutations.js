import types from './types';

export default {
  [types.mutations.SET_THIRDS](state, payload) {
    state.thirds = payload;
  },
  [types.mutations.SET_THIRD](state, payload) {
    state.third = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
