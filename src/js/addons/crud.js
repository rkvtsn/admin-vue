import { postPromise } from '@/js/addons/requests.js';
const ACTIONS = {
  GET_MODEL: 'getmodel',
  LIST: 'list',
  GET: 'get',
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update'
};

function initStore(uri, methods) {
  const state = {
    items: null,
    model: null
  };

  const getters = {
    items(state) { return state.items || []; }
  };

  const actions = {
    [ACTIONS.LIST]({commit, getters}, params = {}) {
      return postPromise(`${uri}/${ACTIONS.LIST}`, {data: {params}})
        .then(r => {
          // commit(ACTIONS.LIST, r.data.content)
          return r;
        });
    },
    [ACTIONS.GET]({commit}, id) {
      return postPromise(
        `${uri}/${ACTIONS.GET}`,
        {data: {params: {id}}});
    },
    [ACTIONS.GET_MODEL]({commit}, id) {
      return postPromise(
        `${uri}/${ACTIONS.GET}`,
        {data: {params: {id}}}).then(r => {
        commit(ACTIONS.GET, r.data);
        return r;
      });
    },
    [ACTIONS.CREATE]({commit, dispatch}, item) {
      return postPromise(
        `${uri}/${ACTIONS.CREATE}`,
        {data: item});
    },
    [ACTIONS.DELETE]({commit}, id) {
      return postPromise(
        `${uri}/${ACTIONS.DELETE}`,
        {data: {params: {id}}}).then(() => {
        commit(ACTIONS.DELETE, id);
      });
    },
    [ACTIONS.UPDATE]({commit}, payload) {
      return postPromise(
        `${uri}/${ACTIONS.UPDATE}`, {
          data: payload,
          options: {params: {id: payload.id}}
        }).then((r) => {
        return r;
      });
    }
  };

  const mutations = {
    [ACTIONS.LIST](state, payload) {
      state.items = payload;
    },
    [ACTIONS.DELETE](state, id) {
      state.items = state.items.filter(item => {
        return id !== item.id;
      });
    },
    [ACTIONS.GET](state, payload) {
      state.model = payload;
    }
  };

  return {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
  };
}

function initRoutes(name, pattern) {
  const children = [];

  for (let action of Object.keys(pattern)) {
    children.push({
      path: action,
      name: pattern[action].name,
      component: pattern[action].component,
      meta: {
        permissions: pattern[action].permissions,
        title: pattern[action].title
      }
    });
  }

  const routes = {
    path: name.toLowerCase(),
    name: pattern.index.name,
    component: pattern.index.component,
    meta: {
      breadcrumbs: false,
      title: pattern.list.title,
      to: pattern.list.name
    },
    children
  };

  return routes;
}

export const crud = { initStore, initRoutes, postPromise, ACTIONS };
export default { initStore, initRoutes, postPromise, ACTIONS };
