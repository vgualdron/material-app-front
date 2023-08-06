import types from './types';
import localTicketApi from '../../../api/localTicket/localTicketApi';

export default {
  async [types.actions.LIST_LOCAL_TICKETS]({ commit }) {
    try {
      const response = await localTicketApi.list();
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_LOCAL_TICKETS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
  async [types.actions.GET_LOCAL_TICKET]({ commit }, id) {
    try {
      const response = await localTicketApi.get(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_LOCAL_TICKET, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
  async [types.actions.SAVE_LOCAL_TICKET]({ commit }, payload) {
    try {
      const response = await localTicketApi.save(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
  async [types.actions.UPDATE_LOCAL_TICKET]({ commit }, payload) {
    try {
      const response = await localTicketApi.update(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
  async [types.actions.DELETE_LOCAL_TICKET]({ commit }, payload) {
    try {
      const response = await localTicketApi.delete(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
    }
  },
};
