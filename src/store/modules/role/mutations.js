import types from './types';

export default {
  [types.mutations.SET_ROLES](state, payload) {
    state.roles = payload;
  },
  [types.mutations.SET_ROLE](state, payload) {
    state.role = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
