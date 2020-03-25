export default {
  install: function install(Vue, options = {
    debug: false,
    info: true,
    warning: false,
    error: true
  }) {
    const time = new Date().toLocaleTimeString('ru');

    Vue.$debug = Vue.prototype.$debug = (msg) => {
      if (options.debug === true) {
        console.log(`DEBUG: ${time}`, msg);
      }
    };

    Vue.$info = Vue.prototype.$info = (msg) => {
      if (options.info === true) {
        console.log(`INFO: ${time}`, msg);
      }
    };

    Vue.$warning = Vue.prototype.$warning = (msg) => {
      if (options.warning === true) {
        console.log(`WARNING: ${time}`, msg);
      }
    };

    Vue.$error = Vue.prototype.$error = (msg) => {
      if (options.error === true) {
        console.log(`ERROR: ${time}`, msg);
      }
    };
  }
};
