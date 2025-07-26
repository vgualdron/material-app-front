import types from './types';
import reportApi from '../../../api/report/reportApi';

export default {
  async [types.actions.GET_MOVEMENTS]({ commit }, payload) {
    try {
      const response = await reportApi.movements(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_REPORTS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_REPORTS, []);
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
  async [types.actions.GET_YARD_STOCK]({ commit }, payload) {
    try {
      const response = await reportApi.yardStock(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_REPORTS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_REPORTS, []);
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
  async [types.actions.GET_PRODUCTION]({ commit }, payload) {
    try {
      const response = await reportApi.productions(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_REPORTS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_REPORTS, []);
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
  async [types.actions.GET_COMPLETE_TRANSFERS]({ commit }, payload) {
    try {
      const response = await reportApi.completeTransfers(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_REPORTS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_REPORTS, []);
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
  async [types.actions.GET_UNCOMPLETE_TRANSFERS]({ commit }, payload) {
    try {
      const response = await reportApi.uncompleteTransfers(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_REPORTS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_REPORTS, []);
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
  async [types.actions.GET_UNBILLED_PURCHASES]({ commit }, payload) {
    try {
      const response = await reportApi.unbilledPurchases(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_REPORTS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_REPORTS, []);
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
  async [types.actions.GET_UNBILLED_SALES]({ commit }, payload) {
    try {
      const response = await reportApi.unbilledSales(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_REPORTS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_REPORTS, []);
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
  async [types.actions.GET_UNBILLED_FREIGHTS]({ commit }, payload) {
    try {
      const response = await reportApi.unbilledFreights(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_REPORTS, response.data.data);
    } catch (error) {
      commit(types.mutations.SET_REPORTS, []);
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
    reportApi.generatePrintDocument(payload.data, payload.fileName);
  },
};
