import API from '@/js/addons/api.js';

const ROLES = {
  LIST: 'list',
  GET: 'get',
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update'
};

const state = {
  items: null
};

const getters = {
  items(state) {
    return state.items || [];
  }
};

const api = API('roles');

const actions = {
  [ROLES.LIST]({commit}, params = {}) {
    return api.list(params).then(r => r);
  },
  [ROLES.GET]({commit}, id) {
    return api.get(id);
  },
  [ROLES.CREATE]({commit, dispatch}, item) {
    return api.create(item);
  },
  [ROLES.DELETE]({commit}, id) {
    return api.delete(id);
  },
  [ROLES.UPDATE]({commit}, role) {
    return api.update(role);
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
