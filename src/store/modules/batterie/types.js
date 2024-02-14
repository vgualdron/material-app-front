export default {
  PATH: '@module/batterie',
  actions: {
    LIST_BATTERIES: '@actions/listBatteries',
    GET_BATTERIE: '@actions/getBatterie',
    SAVE_BATTERIE: '@actions/saveBatterie',
    UPDATE_BATTERIE: '@actions/updateBatterie',
    DELETE_BATTERIE: '@actions/deleteBatterie',
  },
  getters: {
  },
  mutations: {
    SET_BATTERIES: '@mutations/setBatteries',
    SET_BATTERIE: '@mutations/setBatterie',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
