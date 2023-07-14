export default {
  PATH: '@module/localDataManagement',
  actions: {
    GET_DATA: '@actions/getData',
    SET_DATA: '@actions/setData',
  },
  getters: {
  },
  mutations: {
    SET_DATA: '@mutations/setData',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
