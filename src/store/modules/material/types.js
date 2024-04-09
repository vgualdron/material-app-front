export default {
  PATH: '@module/material',
  actions: {
    LIST_MATERIALS: '@actions/listMaterials',
    GET_MATERIAL: '@actions/getMaterial',
    GET_MATERIALS_BY_YARD: '@actions/getMaterialsByYard',
    SAVE_MATERIAL: '@actions/saveMaterial',
    UPDATE_MATERIAL: '@actions/updateMaterial',
    DELETE_MATERIAL: '@actions/deleteMaterial',
  },
  getters: {
  },
  mutations: {
    SET_MATERIALS: '@mutations/setMaterials',
    SET_MATERIAL: '@mutations/setMaterial',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
