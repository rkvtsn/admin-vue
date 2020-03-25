var u = window.u;

var NicSidebar = {
  name: 'nic-sidebar',
  props: {
    model: {
      type: Array,
      dafault: []
    }
  },
  created: function() {
    this.isTree = true;
  },
  methods: {
    click: function(item) {
      this.$emit('click', item);
    }
  },
  template: '<div class="nav nav-sidebar"><ul>' +
              '<slot></slot>' +
              '<nic-sidebar-item :key="index" v-for="(m, index) in model" :model="m"></nic-sidebar-item>' +
            '</ul></div>'
};
var NicSidebarItem = {
  name: 'nic-sidebar-item',
  data: function() {
    var hasSelectedItem = false;

    if (u.isDef(this.model.children)) {
      this.model.children.forEach(function(r) {
        if (r.selected) {
          hasSelectedItem = true;
        }
      });
    }
    return {
      open: !!this.model.open,
      selected: !!this.model.selected,
      hasSelected: hasSelectedItem
    };
  },
  props: {
    offsetStep: {
      type: Number,
      default: 12
    },
    offset: {
      type: Number,
      default: 12
    },
    model: {
      type: Object,
      dafault: {}
    }
  },
  computed: {
    isFolder: function() {
      return this.model.children && this.model.children.length;
    },
    hasSelectedItem: function() {
      return this.selected;
    },
    nextOffset: function() {
      return this.offset + this.offsetStep;
    },
    paddingLeft: function() {
      return this.offset + 'px';
    }
  },
  created: function() {
    var that = this;
    var parent = this.$parent;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }
    if (this.selected) {
      this.$parent.open = true;
    }
    this.tree.$on('deselect', function() {
      that.deselect();
    });
  },
  methods: {
    onClickGroup: function() {
      this.hasSelected = true;
    },
    onClickItem: function() {
      this.tree.click(this);
      this.select();
    },
    onClickGroupToggle: function() {
      if (this.isFolder) {
        this.open = !this.open;
      }
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
    findByText: function(text) {

    },
    expand: function() {
      if (this.isFolder) {
        this.open = true;
      }
    },
    collapse: function() {
      if (this.isFolder) {
        this.open = false;
      }
    },
    select: function() {
      this.tree.$emit('deselect');
      this.selected = true;
    },
    deselect: function() {
      this.selected = false;
      this.hasSelected = false;

      var childrens = this.$children;

      for (var i in childrens) {
        var c = childrens[i];
        c.deselect();
      }
    },
    append: function(node) {
      if (u.isUndef(this.model.children)) {
        this.$set(this.model, 'children', []);
      }
      this.model.children.push(node);
    }
  },
  template:
  '<li v-if="isFolder" :class="[hasSelected ? \'has-selected-item\' : \'\']">' +
    '<a @click.prevent="onClickGroupToggle" class="sidebar-folder" v-bind:style="{\'padding-left\':paddingLeft, \'box-sizing\':\'padding-box\'}">' +
      '<span class="text">{{model.text}}</span>' +
      '<span :class="[\'icon\', open ? \'icon-down-open\' : \'icon-right-open\']" style="position:absolute; right:9px; top:9px;"></span>' +
    '</a>' +
    '<ul v-show="open" v-on:click="onClickGroup" >' +
        '<nic-sidebar-item v-bind:key="model.uid" v-for="model in model.children" :model="model" :offset="nextOffset"></nic-sidebar-item>' +
    '</ul>' +
  '</li>' +
  '<li v-else>' +
    '<a @click="onClickItem" :class="[selected ? \'active\' : \'\']" v-bind:style="{\'padding-left\':paddingLeft, \'box-sizing\':\'padding-box\'}">' +
      '<span class="text">{{model.text}}</span>' +
    '</a>' +
  '</li>'
};
var NicNavbarPlugin = {
  install: function install(Vue) {
    Vue.component('nic-sidebar', NicSidebar);
    Vue.component('nic-sidebar-item', NicSidebarItem);
  }
};

if (typeof module !== 'undefined') {
  module.exports = NicNavbarPlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicNavbarPlugin);
}
