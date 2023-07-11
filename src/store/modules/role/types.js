export default {
  PATH: '@module/role',
  actions: {
    LIST_ROLES: '@actions/listRoles',
    GET_ROLE: '@actions/getRole',
    SAVE_ROLE: '@actions/saveRole',
    UPDATE_ROLE: '@actions/updateRole',
    DELETE_ROLE: '@actions/deleteRole',
  },
  getters: {
  },
  mutations: {
    SET_ROLES: '@mutations/setRoles',
    SET_ROLE: '@mutations/setRole',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
