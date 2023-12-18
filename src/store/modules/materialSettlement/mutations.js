import types from './types';

export default {
  [types.mutations.SET_MATERIAL_SETTLEMENTS](state, payload) {
    state.settlements = payload;
  },
  [types.mutations.SET_MATERIAL_SETTLEMENT](state, payload) {
    state.settlement = payload;
  },
  [types.mutations.SET_SETTLEMENT_TO_PRINT](state, payload) {
    state.settlementToPrint = payload;
  },
  [types.mutations.SET_TICKETS_TO_SETTLE](state, payload) {
    state.ticketsToSettle = payload;
  },
  [types.mutations.SET_MOVEMENTS](state, payload) {
    state.movements = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
