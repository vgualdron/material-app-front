import types from './types';

export default {
  [types.mutations.SET_DATA](state, payload) {
    state.data = payload;
  },
  [types.mutations.SET_LOCAL_THIRDS](state, payload) {
    state.localThirds = payload;
  },
  [types.mutations.SET_LOCAL_MATERIALS](state, payload) {
    state.localMaterials = payload;
  },
  [types.mutations.SET_LOCAL_YARDS](state, payload) {
    state.localYards = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_THIRD_STATUS](state, payload) {
    state.thirdStatus = payload;
  },
  [types.mutations.SET_YARD_STATUS](state, payload) {
    state.yardStatus = payload;
  },
  [types.mutations.SET_MATERIAL_STATUS](state, payload) {
    state.materialStatus = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
  [types.mutations.SET_THIRD_RESPONSE_MESSAGES](state, payload) {
    state.thirdResponseMessages = payload;
  },
  [types.mutations.SET_YARD_RESPONSE_MESSAGES](state, payload) {
    state.yardResponseMessages = payload;
  },
  [types.mutations.SET_MATERIAL_RESPONSE_MESSAGES](state, payload) {
    state.materialResponseMessages = payload;
  },
};
