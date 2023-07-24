import types from './types';

export default {
  [types.mutations.SET_TICKETS](state, payload) {
    state.tickets = payload;
  },
  [types.mutations.SET_TICKET](state, payload) {
    state.ticket = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
