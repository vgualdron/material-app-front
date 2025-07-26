import types from './types';
import authApi from '../../../api/auth/authApi';

export default {
  async [types.actions.SIGN_IN]({ commit }, payload) {
    try {
      const response = await authApi.signin(payload);
      commit(types.mutations.SET_STATUS_SIGN, true);
      commit(types.mutations.SET_PERMISSIONS, response.data.permissions);
      commit(types.mutations.SET_MENU, response.data.menu);
      commit(types.mutations.SET_YARD, response.data.user.yard);
      commit(types.mutations.SET_CURRENT_YARD, response.data.user.currentYard);
      commit(types.mutations.SET_LIST_YARDS, response.data.user.listYards);
      commit(types.mutations.SET_USER, response.data.user.user);
      commit(types.mutations.SET_DOCUMENT, response.data.user.document);
      commit(types.mutations.SET_NAME, response.data.user.name);
      commit(types.mutations.SET_TOKEN, response.data.token);
      commit(types.mutations.SET_ROLES, response.data.roles);
    } catch (error) {
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_STATUS_SIGN, false);
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
  async [types.actions.SIGN_OUT]({ commit }) {
    try {
      await authApi.signout();
      commit(types.mutations.SET_STATUS_SIGN, true);
      commit(types.mutations.SET_PERMISSIONS, []);
      commit(types.mutations.SET_MENU, []);
      commit(types.mutations.SET_YARD, 0);
      commit(types.mutations.SET_USER, '');
      commit(types.mutations.SET_DOCUMENT, '');
      commit(types.mutations.SET_NAME, '');
      commit(types.mutations.SET_TOKEN, '');
      commit(types.mutations.SET_ROLES, []);
    } catch (error) {
      if (error.message !== 'Network Error') {
        if (error.response.status && error.response.status === 401) {
          commit(types.mutations.SET_STATUS_SIGN, true);
          commit(types.mutations.SET_PERMISSIONS, []);
          commit(types.mutations.SET_MENU, []);
          commit(types.mutations.SET_YARD, 0);
          commit(types.mutations.SET_USER, '');
          commit(types.mutations.SET_DOCUMENT, '');
          commit(types.mutations.SET_NAME, '');
          commit(types.mutations.SET_TOKEN, '');
          commit(types.mutations.SET_ROLES, []);
        } else {
          commit(types.mutations.SET_STATUS_SIGN, false);
          commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
        }
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
};
