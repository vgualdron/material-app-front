import types from './types';
import localDataManagementApi from '../../../api/localDataManagement/localDataManagementApi';

export default {
  async [types.actions.GET_DATA]({ commit }) {
    try {
      const response = await localDataManagementApi.getData();
      console.log(response);
      console.log(response.data.data);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_DATA, response.data.data);
    } catch (error) {
      console.log('----------------');
      console.log(error);
      /* commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      } */
    }
  },
  async [types.actions.SET_DATA]({ commit }, payload) {
    try {
      const response = await localDataManagementApi.setData(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
};
