export default {
  PATH: '@module/rate',
  actions: {
    LIST_RATES: '@actions/listRates',
    GET_RATE: '@actions/getRate',
    SAVE_RATE: '@actions/saveRate',
    UPDATE_RATE: '@actions/updateRate',
    DELETE_RATE: '@actions/deleteRate',
  },
  getters: {
  },
  mutations: {
    SET_RATES: '@mutations/setRates',
    SET_RATE: '@mutations/setRate',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
