export default {
  PATH: '@module/production',
  actions: {
    LIST_PRODUCTIONS: '@actions/listProductions',
    GET_PRODUCTION: '@actions/getProduction',
    SAVE_PRODUCTION: '@actions/saveProduction',
    UPDATE_PRODUCTION: '@actions/updateProduction',
    DELETE_PRODUCTION: '@actions/deleteProduction',
  },
  getters: {
  },
  mutations: {
    SET_PRODUCTIONS: '@mutations/setProductions',
    SET_PRODUCTION: '@mutations/setProduction',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
