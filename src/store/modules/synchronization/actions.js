import types from './types';
import synchronizationApi from '../../../api/synchronization/synchronizationApi';

export default {
  async [types.actions.SYNCHRONIZATION_SYNCHRONIZE]({ commit }, payload) {
    try {
      const response = await synchronizationApi.synchronize(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
      commit(types.mutations.SET_DATA, response.data.data);
      commit(types.mutations.SET_WARNING_RESPONSE_MESSAGES, response.data.warnings);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
        commit(types.mutations.SET_WARNING_RESPONSE_MESSAGES, error.response.data.warnings);
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
