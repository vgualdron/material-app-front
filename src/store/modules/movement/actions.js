import types from './types';
import movementApi from '../../../api/movement/movementApi';

export default {
  async [types.actions.LIST_MOVEMENTS]({ commit }, payload) {
    try {
      const response = await movementApi.list(payload);
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
  async [types.actions.PRINT_MOVEMENT]({ commit }, payload) {
    try {
      const response = await movementApi.print(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_MOVEMENTS_TO_PRINT, response.data.data);
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
  async [types.actions.GET_TICKETS_TO_GENERATE]({ commit }, payload) {
    try {
      const response = await movementApi.getTickets(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_TICKETS_TO_GENERATE, response.data.data);
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
  async [types.actions.GENERATE_MOVEMENTS]({ commit }, payload) {
    try {
      const response = await movementApi.generate(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
      commit(types.mutations.SET_GENERATED_MOVEMENT_DATA, response.data.movement);
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
  async [types.actions.DELETE_MOVEMENT]({ commit }, id) {
    try {
      const response = await movementApi.delete(id);
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
  /* async [types.actions.ADD_SETTLEMENT_INFORMATION]({ commit }, payload) {
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
  }, */
  [types.actions.GENERATE_PRINT_DOCUMENT](contex, payload) {
    movementApi.generatePrintDocument(payload.data, payload.fileName);
  },
  [types.actions.GENERATE_PRINT_SQL_DELETE](contex, payload) {
    movementApi.generatePrintSQLDelete(payload.data, payload.fileName);
  },
};
