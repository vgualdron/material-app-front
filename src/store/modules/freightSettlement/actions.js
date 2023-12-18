import types from './types';
import freightSettlementApi from '../../../api/freightSettlement/freightSettlementApi';

export default {
  async [types.actions.LIST_FREIGHT_SETTLEMENTS]({ commit }, payload) {
    try {
      const response = await freightSettlementApi.list(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_FREIGHT_SETTLEMENTS, response.data.data);
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
  async [types.actions.GET_FREIGHT_SETTLEMENT]({ commit }, id) {
    try {
      const response = await freightSettlementApi.get(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_FREIGHT_SETTLEMENT, response.data.data);
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
      const response = await freightSettlementApi.getTickets(payload);
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
      const response = await freightSettlementApi.settleTickets(payload);
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
      const response = await freightSettlementApi.addInformation(payload);
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
      const response = await freightSettlementApi.validateMovements(id);
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
  async [types.actions.ADD_SETTLEMENT_INFORMATION]({ commit }, payload) {
    try {
      const response = await freightSettlementApi.addInformation(payload);
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
  async [types.actions.PRINT_SETTLEMENT]({ commit }, payload) {
    try {
      const response = await freightSettlementApi.print(payload);
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
      const response = await freightSettlementApi.getSettledTickets(id);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_TICKETS_TO_SETTLE, response.data.data.tickets);
      commit(types.mutations.SET_FREIGHT_SETTLEMENT, response.data.data.settlement);
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
  async [types.actions.DELETE_FREIGHT_SETTLEMENT]({ commit }, payload) {
    try {
      const response = await freightSettlementApi.delete(payload);
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
  async [types.actions.UPDATE_FREIGHT_SETTLEMENT]({ commit }, payload) {
    try {
      const response = await freightSettlementApi.update(payload);
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
    freightSettlementApi.generatePrintDocument(payload);
  },
};
