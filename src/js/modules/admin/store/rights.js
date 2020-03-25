// import { postPromise } from '@/js/addons/requests';
import API from '@/js/addons/api.js';

const RIGHTS = {
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

  items(state) { return state.items || []; }

};

const api = API('rights');

const actions = {
  [RIGHTS.LIST]({commit}, params = {}) {
    return api.list(params).then(r => r);
  },
  [RIGHTS.GET]({commit}, id) {
    return api.get(id);
  },
  [RIGHTS.CREATE]({commit, dispatch}, item) {
    return api.create(item);
  },
  [RIGHTS.DELETE]({commit}, id) {
    return api.delete(id);
  },
  [RIGHTS.UPDATE]({commit}, role) {
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
