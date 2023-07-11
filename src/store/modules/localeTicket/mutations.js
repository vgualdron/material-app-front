import types from './types';

export default {
  [types.mutations.SET_LOCALE_TICKETS](state, payload) {
    state.localeTickets = payload;
  },
  [types.mutations.SET_LOCALE_TICKET](state, payload) {
    state.localeTicket = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};
