export default {
  PATH: '@module/third',
  actions: {
    LIST_THIRDS: '@actions/listThirds',
    GET_THIRD: '@actions/getThird',
    SAVE_THIRD: '@actions/saveThird',
    UPDATE_THIRD: '@actions/updateThird',
    DELETE_THIRD: '@actions/deleteThird',
    SAVE_THIRDS_IN_BATCH: '@actions/saveThirdsInBatch',
  },
  getters: {
  },
  mutations: {
    SET_THIRDS: '@mutations/setThirds',
    SET_THIRD: '@mutations/setThird',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
