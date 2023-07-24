import types from './types';

export default {
  [types.mutations.SET_LOCAL_TICKETS](state, payload) {
    state.localTickets = payload;
  },
  [types.mutations.SET_LOCAL_TICKET](state, payload) {
    state.localTicket = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
