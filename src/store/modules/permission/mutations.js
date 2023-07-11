import types from './types';

export default {
  [types.mutations.SET_PERMISSIONS](state, payload) {
    state.permissions = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
