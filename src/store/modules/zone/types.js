export default {
  PATH: '@module/zone',
  actions: {
    LIST_ZONES: '@actions/listZones',
    GET_ZONE: '@actions/getZone',
    SAVE_ZONE: '@actions/saveZone',
    UPDATE_ZONE: '@actions/updateZone',
    DELETE_ZONE: '@actions/deleteZone',
  },
  getters: {
  },
  mutations: {
    SET_ZONES: '@mutations/setZones',
    SET_ZONE: '@mutations/setZone',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
