import types from './types';
import materialSettlementApi from '../../../api/materialSettlement/materialSettlementApi';

export default {
  async [types.actions.LIST_MATERIAL_SETTLEMENTS]({ commit }, payload) {
    try {
      const response = await materialSettlementApi.list(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_MATERIAL_SETTLEMENTS, response.data.data);
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
  async [types.actions.GET_MATERIAL_SETTLEMENT]({ commit }, id) {
    try {
      const response = await materialSettlementApi.get(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_MATERIAL_SETTLEMENT, response.data.data);
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
  async [types.actions.GET_TICKETS_TO_SETTLE]({ commit }, payload) {
    try {
      const response = await materialSettlementApi.getTickets(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_TICKETS_TO_SETTLE, response.data.data);
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
  async [types.actions.SETTLE_TICKETS]({ commit }, payload) {
    try {
      const response = await materialSettlementApi.settleTickets(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
      commit(types.mutations.SET_SETTLEMENT_TO_PRINT, response.data.data);
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
  async [types.actions.ADD_SETTLEMENT_INFORMATION]({ commit }, payload) {
    try {
      const response = await materialSettlementApi.addInformation(payload);
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
  async [types.actions.VALIDATE_MOVEMENTS]({ commit }, id) {
    try {
      const response = await materialSettlementApi.validateMovements(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_MOVEMENTS, response.data.data);
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
  async [types.actions.PRINT_SETTLEMENT]({ commit }, payload) {
    try {
      const response = await materialSettlementApi.print(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_SETTLEMENT_TO_PRINT, response.data.data);
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
  async [types.actions.GET_SETTLED_TICKETS]({ commit }, id) {
    try {
      const response = await materialSettlementApi.getSettledTickets(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_TICKETS_TO_SETTLE, response.data.data.tickets);
      commit(types.mutations.SET_MATERIAL_SETTLEMENT, response.data.data.settlement);
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
  async [types.actions.DELETE_MATERIAL_SETTLEMENT]({ commit }, payload) {
    try {
      const response = await materialSettlementApi.delete(payload);
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
  async [types.actions.UPDATE_MATERIAL_SETTLEMENT]({ commit }, payload) {
    try {
      const response = await materialSettlementApi.update(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
      commit(types.mutations.SET_SETTLEMENT_TO_PRINT, response.data.data);
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
  [types.actions.GENERATE_PRINT_DOCUMENT](contex, payload) {
    materialSettlementApi.generatePrintDocument(payload);
  },
};
