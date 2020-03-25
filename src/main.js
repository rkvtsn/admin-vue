// Точка входа в приложение
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import VueLogger from './js/addons/logger';
import router from './js/router';
import { store } from './js/store';
import init from './package';
import register from './js/modules';

// Модули:
import admin from './js/modules/admin';
import fcp from './js/modules/fcp';

// Регистрируем модули:
register(admin, store, router);
register(fcp, store, router);

Vue.config.productionTip = false;

init(Vue);

// Файл конфига
const configFile = require('./config.json');

// Файл конфигураций и только потом остальное
Vue.http
  .get(configFile)
  .then(r => {
    const config = r.body;
    return config;
  })
  .then(config => {
    // Установка вывода дебага в консоль
    Vue.use(VueLogger, config.logger);
    Vue.http.options.root = config['api-address'];
    Vue.http.options.crossOrigin = true;
    Vue.http.options.credentials = true;

    store
      .dispatch('loadFromStorage')
      .then(() => {
        Vue.http.interceptors.push({
          response: function(response) {
            Vue.$debug(response);
          },
        });
        return config;
      })
      .then(config => {
        /* eslint-disable no-new */
        // console.log({config});
        new Vue({
          el: '#app',
          router,
          store,
          components: {
            App,
          },
          template: `<App
                      version="${config['version']}"
                      release-version="${config['release-version']}"
                      release-date="${config['release-date']}"
                      project-name="${config['project-name']}" />`,
        });
      });
  });
