import { preparePassword } from '@/js/addons/requests';
import API from '@/js/addons/api.js';

const USERS = {
  LIST: 'list',
  GET: 'get',
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update',
  ACTIVATE: 'activate'
};

const state = {
  items: null
};

const getters = {
  items(state) {
    return state.items || [];
  }
};

const api = API('users');

const actions = {

  [USERS.LIST]({rootGetters}, params = {}) {
    const url = (rootGetters.isAuthorized) ? 'list/all' : 'list';
    return api.request(url, {data: params}).then(r => r);
  },

  [USERS.GET]({commit}, id) {
    return api.get(id);
  },

  [USERS.CREATE]({commit}, {userName, password, fullName, roleList}) {
    const user = (password) ? {userName: userName, password: preparePassword(password), fullName, roleList}
      : {userName: userName, fullName, roleList};
    return api.create(user);
  },

  [USERS.DELETE]({commit}, id) {
    return api.delete(id);
  },

  [USERS.ACTIVATE]({commit}, id) {
    return api.request('activate', {options: {params: {id}}});
  },

  [USERS.UPDATE]({commit}, {id, userName, password, fullName, roleList}) {
    const user = (password) ? {id, userName, password: preparePassword(password), fullName, roleList}
      : {id, userName, fullName, roleList};
    return api.update(user);
  }
};

const mutations = {

};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
