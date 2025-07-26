import types from './types';

export default {
  [types.mutations.SET_PRODUCTIONS](state, payload) {
    state.productions = payload;
  },
  [types.mutations.SET_PRODUCTION](state, payload) {
    state.production = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
