import types from './types';

export default {
  [types.mutations.SET_STATUS](state, payload) {
    state.plans = payload;
  },
};
