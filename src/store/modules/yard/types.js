export default {
  PATH: '@module/yard',
  actions: {
    LIST_YARDS: '@actions/listYards',
    GET_YARD: '@actions/getYard',
    SAVE_YARD: '@actions/saveYard',
    UPDATE_YARD: '@actions/updateYard',
    DELETE_YARD: '@actions/deleteYard',
  },
  getters: {
  },
  mutations: {
    SET_YARDS: '@mutations/setYards',
    SET_YARD: '@mutations/setYard',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
