/**
 * Usage:
 *
 * <nic-app>
 *  <nic-app-header title="Project Name" sprite="sprite-mix" v-on:click="onClickBrandNameBtn">
 *  ...
 *  </nic-app-header>
 *  <nic-app-body>
 *    ...
 *  </nic-body>
 *  <nic-app-footer>
 *  ...
 *  </nic-footer>
 * </nic-app>
 *
 *
 */

var u = window.u;

var NicApp = {
  name: 'nic-app',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  template: '<div class="nic-app"><slot></slot></div>'
};

var NicAppHeader = {
  name: 'nic-app-header',
  props: {
    title: '',
    sprite: ''
  },
  computed: {
    hasSprite: function() {
      if (u.isUndef(this.sprite)) {
        return false;
      } else if (this.sprite == '') {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    click: function(item) {
      this.$emit('click', item);
    }
  },
  template: '<div class="nic-app-header navbar navbar-fixed-top">' +
    '<div class="container-fluid">' +
       '<div class="navbar-header">' +
          '<a class="navbar-brand" v-on:click="click" href="javascript:;"><span v-if="hasSprite" class="sprite sprite-large" :class="sprite"></span>{{title}}</a>' +
       '</div>' +
       '<div class="navbar-collapse collapse">' +
          '<slot></slot>' +
        '</div>' +
    '</div>' +
  '</div>'
};
var NicAppFooter = {
  name: 'nic-app-footer',
  props: {
    title: ''
  },
  template: '<div class="nic-app-footer navbar navbar-fixed-bottom">' +
    '<div class="container" style="text-align: center">' +
      '<slot></slot>' +
    '</div>' +
  '</div>'
};
var NicAppBody = {
  name: 'nic-app-body',
  computed: {
    hasSidebar: function() {
      if (u.isDef(this.$slots['sidebar'])) {
        return true;
      } else {
        return false;
      }
    },
    hasMainbar: function() {
      if (u.isDef(this.$slots['mainbar'])) {
        return true;
      } else {
        return false;
      }
    }
  },
  template: '<div class="nic-app-body container-fluid" style="height: 100%">' +
    '<div v-if="hasSidebar" class="row" style="height: 100%">' +
      // '<div class="col-sm-3 col-md-2">' +
        '<slot name="sidebar"></slot>' +
      // '</div>' +
      // '<div class="col-sm-9 col-sm-offset-3  col-md-10 col-md-offset-2 mainbar">' +
        '<slot name="mainbar"></slot>' +
      // '</div>' +
    '</div>' +
    '<div v-else-if="hasMainbar" class="row" style="height: 100%">' +
      '<slot name="mainbar"></slot>' +
    '</div>' +
    '<div v-else class="row" style="height: 100%">' +
      '<slot></slot>' +
    '</div>' +
  '</div>'
};

var NicAppPlugin = {
  install: function install(Vue) {
    Vue.component('nic-app', NicApp);
    Vue.component('nic-app-header', NicAppHeader);
    Vue.component('nic-app-body', NicAppBody);
    Vue.component('nic-app-footer', NicAppFooter);
  }
};

if (typeof module !== 'undefined') {
  module.exports = NicAppPlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicAppPlugin);
}
