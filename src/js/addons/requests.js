import Vue from 'vue';
import {
  store,
  MUTATIONS
} from '../store';
import router from '../router';
// var Vue = (require('../nic/core/vue')).Vue;
var md5 = require('../nic/core/md5').md5;

function preparePassword(password) {
  return md5(password);
}

function downloadFile(url, filename, { data, options }) {
  if (!options) {
    options = {};
  }
  options.responseType = 'blob';
  postPromise(url, {
    data,
    options
  }).then(r =>
    saveBlobAsFile([r], filename)
  );
}

var saveBlobAsFile = (function() {
  var a = document.createElement("a");
  a.style.cssText = "display: none";
  // if (a.style.cssText) {

  // } else {
  //   a.style = "display: none";
  // }
  document.body.appendChild(a);
  return function(data, name) {
    let blob = new Blob(data, {
      type: "octet/stream"
    });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.dispatchEvent(new MouseEvent(`click`, {
      bubbles: true,
      cancelable: true,
      view: window
    }));
    a.remove();
  };
}());

function postPromise(url, {
  data,
  options,
  notoken,
  silent
}) {
  Vue.$debug(url);
  let errors = null;
  let result = null;

  store.commit(MUTATIONS.SET_ERRORS, null);

  if (store.getters.token && !notoken) {
    if (!options) {
      options = {
        params: {}
      };
    } else if (!options.params) {
      options.params = {};
    }

    options.params.token = store.getters.token;
  }
  return new Promise((resolve, reject) => {
    Vue.http.post(url, data, options)
      .then(function(response) {
        sessionStorage.setItem('requestRetry', 0);
        Vue.$debug(response);
        const r = response;
        const d = r.body;
        if (d.result || (options && options.responseType && options.responseType === 'blob')) {
          result = d;
        } else {
          errors = d.messageError;
          if (silent !== true) {
            store.commit(MUTATIONS.SET_ERRORS, errors);
          }
          let vErrors = response.validationErrors || d.validationErrors || null;
          let validationErrors = [];
          if (vErrors !== null) {
            for (let key in vErrors) {
              validationErrors.push(vErrors[key]);
            }
          }
          store.commit(MUTATIONS.SET_VALIDATION_ERRORS, [].concat.apply([], validationErrors));
          if (d.statusCode === 403) {
            disconnect();
          }

          let msg = errors;
          if (validationErrors.length > 0) {
            let validationMessage = '';
            for (let m of validationErrors) {
              validationMessage += `<li class="error-line">${m}</li>`;
            }
            msg = `<ul class="error-list">${validationMessage} </ul>`;
          }
          if (silent !== true) Vue.$notify.error(msg, {mode: 'html', duration: 1400, visibility: 7000});

          reject(response);
        }
        resolve(result);
      }).catch(function(response) {
        Vue.$error(response);
        store.commit(MUTATIONS.SET_VALIDATION_ERRORS, null);
        store.commit(MUTATIONS.SET_ERRORS, 'Ошибка сервера! Перезагрузите страницу');
        if (sessionStorage.getItem('requestRetry') >= 3) {
          disconnect();
        } else {
          sessionStorage.setItem('requestRetry', (sessionStorage.getItem('requestRetry') || 0) + 1);
        }
        reject(response);
      });
  });
}

let reqSSMP = function(url) {
  let keys = [
    'notify_hostname',
    'notify_userName',
    'notify_password'
  ];
  let params = {};
  return postPromise('settings/find', { options: {params: {'keys': keys.toString()}} }).then(r => {
    if (!r.data || r.data.length === 0) {
      return Promise.reject('Не установлены настройки подключения к ССМП или настройки некорректны');
    }
    for (let i = 0; i < r.data.length; i++) {
      params[r.data[i].key] = r.data[i].value;
    }
    url = params.notify_hostname + url;
    return Vue.http.get(url, { headers: { Authorization: btoa(params.notify_userName + ':' + params.notify_password) } });
  });
};

let disconnect = function() {
  Vue.$info('disconnected');
  store.dispatch('logout').then(e => {
    router.push({
      name: 'LoginForm.vue'
    });
  });
};

export default {
  reqSSMP,
  postPromise,
  preparePassword,
  downloadFile
};

export {
  reqSSMP,
  postPromise,
  preparePassword,
  downloadFile
};
