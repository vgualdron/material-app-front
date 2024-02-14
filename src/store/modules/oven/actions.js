import types from './types';
import ovenApi from '../../../api/oven/ovenApi';

export default {
  async [types.actions.LIST_OVENS]({ commit }, payload) {
    try {
      const response = await ovenApi.list(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_OVENS, response.data.data);
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
  async [types.actions.GET_OVEN]({ commit }, id) {
    try {
      const response = await ovenApi.get(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_OVEN, response.data.data);
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
  async [types.actions.SAVE_OVEN]({ commit }, payload) {
    try {
      const response = await ovenApi.save(payload);
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
  async [types.actions.UPDATE_OVEN]({ commit }, payload) {
    try {
      const response = await ovenApi.update(payload);
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
  async [types.actions.DELETE_OVEN]({ commit }, payload) {
    try {
      const response = await ovenApi.delete(payload);
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
