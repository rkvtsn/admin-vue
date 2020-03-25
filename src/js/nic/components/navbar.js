/**
 *
 * Usage:
 *
 * <nic-navbar :model="navbarMenu" class="navbar-right" v-on:click="onClickNavbarItem"></nic-navbar>
 *
 * var app = new Vue({
 *  data: {
 *    navbarMenu: [{
 *      uid: 1,
 *      sprite: 'sprite-bell',
 *      badge: '20',
 *      children: [{
 *        uid: 2,
 *        text: 'subdomain'
 *      },{
 *        uid: 3,
 *        text: 'subdomain-2'
 *      }],
 *    },{
 *      uid: 4,
 *      text: 'Справка',
 *      children: [{
 *        uid: 5,
 *        text: 'Поддержка'
 *      }]
 *    }]
 *  }
 * });
 *
 */

var u = window.u;

var NicNavbar = {
  name: 'nic-navbar',
  props: {
    model: {
      type: Array,
      dafault: [],
    },
  },
  created: function() {
    this.isTree = true;
  },
  methods: {
    click: function(item) {
      this.$emit ('click', item);
    },
  },
  template: '<div><ul class="nav navbar-nav"><slot><nic-navbar-item v-bind:key="m.uid" v-for="m in model" :model="m"></nic-navbar-item></slot></ul></div>',
};

var NicNavbarDropdown = {
  name: 'nic-navbar-dropdown',
  data: function() {
    return {
      open: false,
    };
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
  watch: {
    open(v) {
      if (!v) {
        document.removeEventListener('click', this.leave, false);
      }
    }
  },
  methods: {
    leave(e) {
      if (!this.$el.contains (e.target)) {
        this.open = false;
      }
    },
    click() {
      if (!this.open) {
        document.addEventListener ('click', this.leave, false);
      }

      this.open = !this.open;
      this.$emit ('click', this);
    },
  },
  template: '<li class="navbar__element navbar__element--dropdown dropdown" :class="{\'open\': open, \'navbar__element--icon\': icon}">' +
    '<a href="#" @click.prevent="click" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' +
    '<span v-if="icon" class="sprite sprite-large" :class="icon"></span>' +
    '<slot>' +
    '{{text}}<span class="caret"></span>' +
    '</slot>' +
    '</a>' +
    "<ul class=\"dropdown-menu\" :style=\"{'display': [open ? 'block' : '']}\">" +
    '<slot name="items">' +
    '<nic-navbar-element :key="i" v-for="(item, i) in items" v-bind="item"></nic-navbar-element>' +
    '</slot>' +
    '</ul></li>',
};

var NicNavbarElement = {
  name: 'nic-navbar-element',
  props: {
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  methods: {
    click: function() {
      this.$emit ('click', this);
      this.$parent.click ();
    },
  },
  template: '<li class="navbar__element" :class="{\'navbar__element--icon\': icon}">' +
    '<slot><a href="#" @click.prevent="click"><span v-if="icon" class="sprite sprite-large" :class="icon"></span>' +
    '<span class="text">{{text}}</span></a></slot>' +
    '</li>',
};

var NicNavbarItem = {
  name: 'nic-navbar-item',
  data: function() {
    return {
      open: !!this.model.open,
      selected: !!this.model.selected,
    };
  },
  props: {
    model: {
      type: Object,
      dafault: {},
    },
  },
  computed: {
    isFolder: function() {
      return this.model.children && this.model.children.length;
    },
  },
  created: function() {},
  methods: {
    onClick: function() {
      this.$emit ('click');
      this.$parent.click ();
    },
    getText: function() {
      return this.model.text;
    },
    getKey: function() {
      return this.model.key;
    },
    getChildren: function() {
      return this.model.children;
    },
    findByText: function(text) {},
    toggle: function() {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    expand: function() {},
    collapse: function() {},
    select: function() {
      this.selected = true;
    },
    deselect: function() {
      this.selected = false;

      var childrens = this.$children;

      for (var i in childrens) {
        var c = childrens[i];
        c.deselect ();
      }
    },
    append: function(node) {
      if (u.isUndef (this.model.children)) {
        this.$set (this.model, 'children', []);
      }
      this.model.children.push (node);
    },
  },
  template: '<li v-if="isFolder" @click.stop="toggle" class="dropdown" :class="[open ? \'open\': \'\']">' +
    '<a class="dropdown-toggle" href="javascript:;">' +
    '<span v-if="model.sprite" class="sprite sprite-large" :class="model.sprite" style="margin-right: 2px;"></span>' +
    '<span class="text">{{model.text}}</span>' +
    '<span v-if="model.badge" class="badge pull-right">{{model.badge}}</span>' +
    '<b v-else class="caret"></b>' +
    '</a>' +
    '<ul v-if="isFolder" class="dropdown-menu">' +
    '<nic-navbar-item v-bind:key="model.uid" v-for="model in model.children" :model="model" v-on:click="onClick"></nic-navbar-item>' +
    '</ul>' +
    '</li>' +
    '<li v-else>' +
    '<a  href="javascript:;" v-on:click="onClick">' +
    '<span v-if="model.sprite" class="sprite sprite-large" :class="model.sprite" style="margin-right: 2px;"></span>' +
    '<span v-if="model.badge" class="badge pull-right">{{model.badge}}</span>' +
    '{{model.text}}' +
    '</a>' +
    '</li>',
};

var NicNavbarPlugin = {
  install: function install(Vue) {
    Vue.component ('nic-navbar', NicNavbar);
    Vue.component ('nic-navbar-item', NicNavbarItem);
    Vue.component ('nic-navbar-dropdown', NicNavbarDropdown);
    Vue.component ('nic-navbar-element', NicNavbarElement);
  },
};
if (typeof module !== 'undefined') {
  module.exports = NicNavbarPlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use (NicNavbarPlugin);
}
