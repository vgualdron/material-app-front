import types from './types';
import localDataManagementApi from '../../../api/localDataManagement/localDataManagementApi';

export default {
  async [types.actions.GET_DATA]({ commit }) {
    try {
      const response = await localDataManagementApi.getData();
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_DATA, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
  async [types.actions.SET_DATA]({ commit }, payload) {
    try {
      const response = await localDataManagementApi.setData(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
  async [types.actions.LIST_LOCAL_THIRDS]({ commit }, payload) {
    try {
      const response = await localDataManagementApi.listLocalThirds(payload);
      commit(types.mutations.SET_THIRD_STATUS, true);
      commit(types.mutations.SET_LOCAL_THIRDS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_THIRD_STATUS, false);
      commit(types.mutations.SET_THIRD_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
  async [types.actions.LIST_LOCAL_MATERIALS]({ commit }, payload) {
    try {
      const response = await localDataManagementApi.listLocalMaterials(payload);
      commit(types.mutations.SET_MATERIAL_STATUS, true);
      commit(types.mutations.SET_LOCAL_MATERIALS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_MATERIAL_STATUS, false);
      commit(types.mutations.SET_MATERIAL_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
  async [types.actions.LIST_LOCAL_YARDS]({ commit }, payload) {
    try {
      const response = await localDataManagementApi.listLocalYards(payload);
      commit(types.mutations.SET_YARD_STATUS, true);
      commit(types.mutations.SET_LOCAL_YARDS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_YARD_STATUS, false);
      commit(types.mutations.SET_YARD_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
};
