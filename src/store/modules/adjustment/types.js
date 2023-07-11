export default {
  PATH: '@module/adjustment',
  actions: {
    LIST_ADJUSTMENTS: '@actions/listAdjustments',
    GET_ADJUSTMENT: '@actions/getAdjustment',
    SAVE_ADJUSTMENT: '@actions/saveAdjustment',
    UPDATE_ADJUSTMENT: '@actions/updateAdjustment',
    DELETE_ADJUSTMENT: '@actions/deleteAdjustment',
  },
  getters: {
  },
  mutations: {
    SET_ADJUSTMENTS: '@mutations/setAdjustments',
    SET_ADJUSTMENT: '@mutations/setAdjustment',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
