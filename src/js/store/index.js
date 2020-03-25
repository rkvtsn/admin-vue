import Vue from 'vue';
import Vuex from 'vuex';

import requests from '@/js/addons/requests';

// var Vue = (require('../nic/core/vue')).Vue;
var md5 = require('../nic/core/md5').md5;

Vue.use(Vuex);

// @VARIABLES
const MUTATIONS = {
  SET_VALIDATION_ERRORS: 'setValidationErrors',
  SET_CURRENT_USER: 'setCurrentUser',
  SET_ERRORS: 'setErrors',
  SET_FROM_LOCAL_STORAGE: 'setFromLocalStorage',
  SET_AUTH_DATA: 'setAuthData',
  SET_RECENT_MODULE: 'setRecentModule',
  ADD_MODULE: 'addIndex',
  RESET_MODULES: 'resetModules'
};
const STORAGE = {
  CURRENT_USER: 'currentUser',
  USER_AUTH_DATA: 'userAuthData',
  // RECENT_MODULES: 'recentModules'
};

const store = new Vuex.Store({
  // @STATE
  state: {
    journalList: null,

    userAuthData: null,
    currentUser: null,

    routes: [],
    modules: [],
    recentModules: [],

    errors: null,
    validationErrors: null,
  },

  // @ACTIONS:
  actions: {
    loadFromStorage({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        commit(MUTATIONS.SET_FROM_LOCAL_STORAGE);
        if (state.currentUser) {
          dispatch('users/get', state.currentUser.id).then(currentUser => {
            state.currentUser.fullName = currentUser.fullName;
            state.currentUser.userName = currentUser.userName;
            state.currentUser.isDeleted = currentUser.isDeleted;
            state.currentUser.roleList = currentUser.roleList;
            state.currentUser.settingsList = currentUser.settingsList;
            localStorage.setItem(
              STORAGE.CURRENT_USER,
              JSON.stringify(state.currentUser)
            );
            commit(MUTATIONS.SET_CURRENT_USER, state.currentUser);
            commit(MUTATIONS.SET_FROM_LOCAL_STORAGE, true);
          });
        }
        resolve();
      });
    },
    addModule({ commit }, module) {
      commit(MUTATIONS.ADD_MODULE, module);
    },
    resetModules({ commit }) {
      commit(MUTATIONS.RESET_MODULES);
    },
    addRecentModule({ commit, state }, module) {
      commit(MUTATIONS.SET_RECENT_MODULE, module);
      requests.postPromise('users/settings/create', {
        data: {
          key: 'recentModules',
          value: JSON.stringify(state.recentModules || []),
        },
      });
      // .then(x => {
      //   commit(MUTATIONS.SET_RECENT_MODULE, module);
      // });
    },
    clearErrors({ commit }) {
      return new Promise((resolve, reject) => {
        commit(MUTATIONS.SET_ERRORS, '');
        resolve();
      });
    },
    setValidationErrors({ commit }, errors) {
      return new Promise((resolve, reject) => {
        commit(MUTATIONS.SET_VALIDATION_ERRORS, [errors]);
        resolve();
      });
    },

    logout({ commit, getters }) {
      return requests
        .postPromise('trusted/logout', {
          data: {
            token: getters.token,
          },
          silent: true,
        })
        .then(result => {
          commit(MUTATIONS.SET_CURRENT_USER, null);
          return result;
        })
        .catch(result => {
          commit(MUTATIONS.SET_CURRENT_USER, null);
          return result;
        })
        .then(e => commit(MUTATIONS.SET_CURRENT_USER, null));
    },
    login({ commit, dispatch }, { userName, password, isRememberMe }) {
      return requests
        .postPromise('trusted/login', {
          data: {
            userName: userName,
            password: md5(password),
          },
          notoken: true,
        })
        .then(result => {
          console.log({
            result,
          });
          let roles = result.data.roleList;
          if (roles.length === 0) {
            commit(MUTATIONS.SET_ERRORS, 'Недостаточно прав доступа');
            return null;
          }
          commit(MUTATIONS.SET_CURRENT_USER, result.data);
          commit(MUTATIONS.SET_AUTH_DATA, {
            isRememberMe,
            userName,
            password,
          });
          commit(MUTATIONS.SET_FROM_LOCAL_STORAGE, true);
          return result;
        })
        .catch(function(result) {
          commit(MUTATIONS.SET_CURRENT_USER, null);
          // commit(MUTATIONS.SET_ERRORS, result.data.messageError);
          throw result;
        });
    },

    // @JOURNAL
    listJournal({ commit }, params) {
      return requests
        .postPromise('journal/list', {
          data: params,
        })
        .then(result => {
          commit('setJournalList', result.data.content);
          console.log(result.data.content);
          return result;
        });
    },

    deleteBetweenDates({ commit, dispatch }, { from, until }) {
      console.info(from + ' ' + until);
      return requests.postPromise('journal/deleteBetweenDates', {
        data: {
          from: from,
          until: until,
        },
      });
    },

    // @SETTINGS
    findSettings({ commit }, payload) {
      return requests.postPromise('settings/find', {
        options: {
          params: {
            keys: payload.toString(),
          },
        },
      });
    },
    saveSettings({ commit }, payload) {
      return requests.postPromise('settings/save', {
        data: payload,
      });
    },
  },

  // @MUTATIONS
  mutations: {
    [MUTATIONS.SET_VALIDATION_ERRORS](state, payload) {
      if (payload && payload.length === 0) {
        state.validationErrors = null;
      } else {
        state.validationErrors = payload;
      }
    },
    [MUTATIONS.ADD_MODULE](state, routes) {
      state.routes.push(routes);
      state.modules.push(routes()[0]);
    },
    [MUTATIONS.RESET_MODULES](state) {
      state.modules = [];
      for(let r of state.routes) {
        state.modules.push(r()[0]);
      }
      // state.routes.push(routes);
      // state.modules.push(routes()[0]);
    },
    [MUTATIONS.SET_RECENT_MODULE](state, payload) {
      state.recentModules = state.recentModules.filter(x => {
        return x !== payload;
      });
      state.recentModules.unshift(payload);
    },
    [MUTATIONS.SET_FROM_LOCAL_STORAGE](state, withModules = false) {
      state.currentUser = JSON.parse(
        localStorage.getItem(STORAGE.CURRENT_USER) ||
        sessionStorage.getItem(STORAGE.CURRENT_USER) ||
        'null'
      );
      state.userAuthData = JSON.parse(
        localStorage.getItem(STORAGE.USER_AUTH_DATA) || 'null'
      );
      state.recentModules = [];

      if (state.currentUser && state.currentUser.settingsList && withModules) {
        let recentModules = Vue.$util.getBy(
          state.currentUser.settingsList,
          'key',
          'recentModules'
        );

        if (recentModules) {
          if (recentModules.length > 1) {
            recentModules = recentModules[0];
          }
          state.recentModules = JSON.parse(recentModules.value || '[]');
        }
      }
    },
    [MUTATIONS.SET_ERRORS](state, payload) {
      state.errors = payload;
    },
    [MUTATIONS.SET_CURRENT_USER](state, payload) {
      if (payload) {
        sessionStorage.setItem(STORAGE.CURRENT_USER, JSON.stringify(payload));
      } else {
        sessionStorage.removeItem(STORAGE.CURRENT_USER);
        localStorage.removeItem(STORAGE.CURRENT_USER);
      }
      state.currentUser = payload;
    },
    [MUTATIONS.SET_AUTH_DATA](state, { isRememberMe, userName, password }) {
      if (isRememberMe) {
        localStorage.setItem(
          STORAGE.USER_AUTH_DATA,
          JSON.stringify({
            userName,
            password,
            isRememberMe,
          })
        );
        localStorage.setItem(
          STORAGE.CURRENT_USER,
          sessionStorage.getItem(STORAGE.CURRENT_USER)
        );
      } else {
        localStorage.removeItem(STORAGE.USER_AUTH_DATA);
      }
      state.userAuthData = JSON.parse(
        localStorage.getItem(STORAGE.USER_AUTH_DATA) || 'null'
      );
    },

    // @JOURNAL:
    setJournalList(state, payload) {
      state.journalList = payload;
    },
  },
  // @GETTERS:
  getters: {
    modules(state) {
      return function() {
        return state.modules;
      };
    },
    recentModules(state) {
      return state.recentModules;
    },
    currentUser(state) {
      return state.currentUser;
    },
    errors(state) {
      return state.errors;
    },
    isLoading(state) {
      return state.loading;
    },
    isAuthorized(state) {
      return state.currentUser !== null;
    },
    token(state) {
      return state.currentUser != null ? state.currentUser.token : null;
    },
    checkPermissions(state, getters) {
      Vue.$debug(getters.currentPermissions);
      return permissions => {
        if (getters.currentPermissions.indexOf('CONNECT') === -1) {
          return false;
        }
        for (let i = 0; i < permissions.length; i++) {
          if (getters.currentPermissions.indexOf(permissions[i]) !== -1) {
            return true;
          }
        }
        return false;
      };
    },
    currentPermissions(state) {
      if (!state.currentUser) return [];
      let rights = state.currentUser.roleList.map(role => {
        return role.rightList.map(right => {
          return right.name;
        });
      });
      return [].concat.apply([], rights);
    },
    journalList(state) {
      return state.journalList || [];
    },
  },
});

export { store, MUTATIONS, STORAGE };
