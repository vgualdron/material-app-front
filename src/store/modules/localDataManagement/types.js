export default {
  PATH: '@module/localDataManagement',
  actions: {
    GET_DATA: '@actions/getData',
    LIST_LOCAL_THIRDS: '@actions/listLocalThirds',
    LIST_LOCAL_MATERIALS: '@actions/listLocalMaterials',
    LIST_LOCAL_YARDS: '@actions/listLocalYards',
    SET_DATA: '@actions/setData',
  },
  getters: {
  },
  mutations: {
    SET_DATA: '@mutations/setData',
    SET_LOCAL_THIRDS: '@mutations/setLocalThirds',
    SET_LOCAL_MATERIALS: '@mutations/setLocalMaterials',
    SET_LOCAL_YARDS: '@mutations/setLocalYards',
    SET_STATUS: '@mutations/setStatus',
    SET_THIRD_STATUS: '@mutations/setThirdStatus',
    SET_YARD_STATUS: '@mutations/setYardStatus',
    SET_MATERIAL_STATUS: '@mutations/setMaterialStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
    SET_THIRD_RESPONSE_MESSAGES: '@mutations/setThirdResponseMessages',
    SET_YARD_RESPONSE_MESSAGES: '@mutations/setYardResponseMessages',
    SET_MATERIAL_RESPONSE_MESSAGES: '@mutations/setMaterialResponseMessages',
  },
};
