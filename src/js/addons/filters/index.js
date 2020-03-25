export default {
  install: function install(Vue, options = {}) {

    Vue._filters = {};

    /**
     *
     */
    Vue.$filter = Vue.prototype.$filter = function(filterName=null, filter=null) {
      if (!filterName) {
        return Vue._filters;
      }

      if (!filter && filterName) {
        return Vue._filters[filterName];
      }

      Vue.filter(filterName, filter);
      Vue._filters[filterName] = filter;

      return Vue.$filter;
    };

  }
};
