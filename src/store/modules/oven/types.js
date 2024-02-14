export default {
  PATH: '@module/oven',
  actions: {
    LIST_OVENS: '@actions/listOvens',
    GET_OVEN: '@actions/getOven',
    SAVE_OVEN: '@actions/saveOven',
    UPDATE_OVEN: '@actions/updateOven',
    DELETE_OVEN: '@actions/deleteOven',
  },
  getters: {
  },
  mutations: {
    SET_OVENS: '@mutations/setOvens',
    SET_OVEN: '@mutations/setOven',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
