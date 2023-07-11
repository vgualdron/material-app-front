import types from './types';
import homeApi from '../../../api/home/homeApi';

export default {
  async [types.actions.SYNCHRONIZE]({ commit }, payload) {
    try {
      const response = await homeApi.synchronize(payload);
      commit(types.mutations.SET_STATUS, response);
    } catch (error) {
      console.error(error);
    }
  },
};
