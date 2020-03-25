/**
 * ВВ
 *
 * Usage:
 *
 * <nic-tree :model="jsonDataObject" @select="onSelectTreeItemHandler"></nic-tree>
 *
 * @type type
 */
var NicTree = {
  name: 'nic-tree',
  props: {
    model: {
      type: Object,
      dafault: () => {}
    },
    titleKey: {
      type: [Function, String],
      default: 'text'
    },
    childrenKey: {
      type: String,
      default: 'children'
    }
  },
  created: function() {
    this.isTree = true;
  },
  template: '<div class="tree"><ul><nic-tree-item :titleKey="titleKey" :childrenKey="childrenKey" :model="model"></nic-tree-item></ul></div>',
  methods: {
    outClick: function(e) {
      if (!this.$el.contains(e.target)) {
        this.deselect();
      }
    },
    getName: function() {
      if (this.titleKey instanceof Function) {
        return this.titleKey(this.model);
      } else {
        return this.titleKey;
      }
    },
    deselect: function() {
      this.$emit('deselect');
    },
    select: function() {
      if (this.$children && this.$children[0]) {
        this.$children[0].select();
      }
    },
    toggle: function(forced) {
      if (this.$children && this.$children[0]) {
        this.$children[0].toggle(forced);
      }
    }
  }
};
var NicTreeItem = {
  name: 'nic-tree-item',
  template: '<li :class="{\'has-children\': isFolder}">' +
                '<span v-if="isFolder" @click="toggle" :class="[\'sprite\', \'sprite-medium\', open ? \'sprite-minus\' : \'sprite-plus\']"></span>' +
                '<span class="text"  @dblclick.prevent.stop="toggle" @click.prevent.stop="select" :class="[selected ? \'selected\' : \'\']">{{mainText}}</span>' +
                '<ul v-show="open" v-if="isFolder">' +
                    '<nic-tree-item v-bind:key="model.uid" v-for="model in mainChildren" :titleKey="titleKey" :childrenKey="childrenKey" :model="model"></nic-tree-item>' +
                '</ul>' +
            '</li>',
  props: {
    model: {
      type: Object,
      dafault: {}
    },
    titleKey: {
      type: [Function, String],
      default: 'text'
    },
    childrenKey: {
      type: String,
      default: 'children'
    }
  },
  data: function() {
    return {
      open: !!(this.model && this.model.open === true),
      selected: this.model.selected === true
    };
  },
  computed: {
    mainText: function() {
      if (this.titleKey instanceof Function) {
        return this.titleKey(this.model);
      } else {
        return this.model[this.titleKey];
      }
    },
    mainChildren: function() {
      return this.model[this.childrenKey];
    },
    isFolder: function() {
      return this.model[this.childrenKey] && this.model[this.childrenKey].length;
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
    this.tree.$on('deselect', function() {
      that.deselect();
    });
  },
  methods: {
    getText: function() {
        return this.mainText;
    },
    findByText: function(text) {

    },
    toggle: function(forced) {
      if (this.isFolder) {
        this.open = (forced === true) ? true : !this.open;
      }
    },
    expand: function() {
      if (this.$parent !== null && this.$parent.expand instanceof Function) {
        this.$parent.toggle(true);
        this.$parent.expand();
      }
    },
    collapse: function() {

    },
    select: function() {
      this.tree.$emit('deselect');
      this.tree.$emit('select', this);
      this.selected = true;
    },
    deselect: function() {
      this.selected = false;

      var childrens = this.$children;

      for (var i in childrens) {
        var c = childrens[i];
        c.deselect();
      }
    },
    append: function(node) {
      if (this.getChildren) {
        this.$set(this.model, this.childrenKey, []);
      }
      this.model[this.childrenKey].push(node);
    }
  }
};
var NicTreePlugin = {
  install: function install(Vue) {
    Vue.component('nic-tree', NicTree);
    Vue.component('nic-tree-item', NicTreeItem);
  }
};

if (typeof module !== 'undefined') {
  module.exports = NicTreePlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicTreePlugin);
}
