export default {
  PATH: '@module/localTicket',
  actions: {
    LIST_LOCAL_TICKETS: '@actions/listLocalTickets',
    GET_LOCAL_TICKET: '@actions/getLocalTicket',
    SAVE_LOCAL_TICKET: '@actions/saveLocalTicket',
    UPDATE_LOCAL_TICKET: '@actions/updateLocalTicket',
    DELETE_LOCAL_TICKET: '@actions/deleteLocalTicket',
  },
  getters: {
  },
  mutations: {
    SET_LOCAL_TICKETS: '@mutations/setLocalTickets',
    SET_LOCAL_TICKET: '@mutations/setLocalTicket',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
