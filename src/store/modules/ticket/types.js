export default {
  PATH: '@module/ticket',
  actions: {
    LIST_TICKETS: '@actions/listTickets',
    GET_TICKET: '@actions/getTicket',
    SAVE_TICKET: '@actions/saveTicket',
    UPDATE_TICKET: '@actions/updateTicket',
    DELETE_TICKET: '@actions/deleteTicket',
  },
  getters: {
  },
  mutations: {
    SET_TICKETS: '@mutations/setTickets',
    SET_TICKET: '@mutations/setTicket',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
