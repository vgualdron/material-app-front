import types from './types';

export default {
  [types.mutations.SET_MATERIALS](state, payload) {
    state.materials = payload;
  },
  [types.mutations.SET_MATERIAL](state, payload) {
    state.material = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
