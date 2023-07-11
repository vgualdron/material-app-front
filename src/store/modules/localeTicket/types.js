export default {
  PATH: '@module/ticket',
  actions: {
    LIST_LOCALE_TICKETS: '@actions/listLocaleTickets',
    GET_LOCALE_TICKET: '@actions/getLocaleTicket',
    SAVE_LOCALE_TICKET: '@actions/saveLocaleTicket',
    UPDATE_LOCALE_TICKET: '@actions/updateLocaleTicket',
    DELETE_LOCALE_TICKET: '@actions/deleteLocaleTicket',
  },
  getters: {
  },
  mutations: {
    SET_LOCALE_TICKETS: '@mutations/setLocaleTickets',
    SET_LOCALE_TICKET: '@mutations/setLocaleTicket',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
