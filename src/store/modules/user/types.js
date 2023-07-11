export default {
  PATH: '@module/user',
  actions: {
    LIST_USERS: '@actions/listUsers',
    GET_USER: '@actions/getUser',
    SAVE_USER: '@actions/saveUser',
    UPDATE_USER: '@actions/updateUser',
    DELETE_USER: '@actions/deleteUser',
    UPDATE_PROFILE: '@actions/updateProfile',
  },
  getters: {
  },
  mutations: {
    SET_USERS: '@mutations/setUsers',
    SET_USER: '@mutations/setUser',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
