import types from './types';
import permissionApi from '../../../api/permission/permissionApi';

export default {
  async [types.actions.LIST_PERMISSIONS]({ commit }, payload) {
    try {
      const response = await permissionApi.list(payload);
      commit(types.mutations.SET_PERMISSIONS, response.data.data);
      commit(types.mutations.SET_STATUS, true);
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
