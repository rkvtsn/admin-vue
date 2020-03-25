var u = window.u

var NicToolbar = {
  name: 'nic-toolbar',
  props: {
    model: {
      type: Array,
      dafault: []
    }
  },
  methods: {
    click: function (item) {
      this.$emit('click', item)
    },
    getItemByKey: function (key) {
      var items = this.getItems()

      for (var i in items) {
        var item = items[i]

        if (item.getKey() === key) {
          return item
        }
      }
      return -1
    },
    getItems: function () {
      return this.$children
    }
  },
  template: '<div class="nic-toolbar">' +
              '<slot><nic-toolbar-item :key="m.uid" v-bind="m" :itemKey="m.key" :uid="m.uid" @click="click" v-for="(m, index) in model" ></nic-toolbar-item></slot>' +
            '</div>'
}
var NicToolbarItem = {
  name: 'nic-toolbar-item',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    uid: {
      type: Number,
      default: 0
    },
    itemKey: {
      type: String,
      default: ''
    }
  },
  data: function () {
    var dis = this.disabled
    return {
      itemDisabled: dis
    }
  },
  watch: {
    'disabled': function (value) {
      this.itemDisabled = value
    }
  },
  computed: {
    mainType: function () {
      if (u.isDef(this.type)) {
        return this.type
      } else {
        return 'button'
      }
    },
    hasIcon: function () {
      return !!this.icon
    },
    buttonIconClass: function () {
      if (this.icon) {
        return 'sprite sprite-large ' + this.icon
      } else {
        return ''
      }
    },
    buttonStyle: function () {
      if (this.icon) {
        return {
          padding: 0,
          'margin-right': '5px'
        }
      }
    },
    buttonText: function () {
      return this.text || ''
    }
  },
  methods: {
    // Костыль для проброса event'а. Иначе preventDefault никак
    onClick: function (event) {
      this.$emit('click', event)
    },
    getText: function () {
      return this.text
    },
    getKey: function () {
      return this.itemKey
    },
    disable: function () {
      this.itemDisabled = true
    },
    enable: function () {
      this.itemDisabled = false
    },
    isDisabled: function () {
      return this.itemDisabled
    },
    isEnabled: function () {
      return this.itemDisabled
    }
  },
  template: '<div class="nic-toolbar-item" v-if="mainType==\'button\'">' +
    '<button class="btn btn-default" :class="[itemDisabled ? \'disabled\' : \'\']" :style="buttonStyle" v-on:click="onClick">' +
      '<span v-if="hasIcon" :class="buttonIconClass"></span>' +
      '{{buttonText}}' +
    '</button>' +
  '</div>' +
  '<div class="nic-toolbar-item" v-else-if="mainType==\'separator\'">' +
    '<div class="nic-toolbar-separator"></div>' +
  '</div>' +
  '<div class="nic-toolbar-item" v-else-if="mainType==\'slot\'">' +
    '<slot></slot>' +
  '</div>'
}

var NicToolbarPlugin = {
  install: function install (Vue) {
    Vue.component('nic-toolbar', NicToolbar)
    Vue.component('nic-toolbar-item', NicToolbarItem)
  }
}

if (typeof module !== 'undefined') {
  module.exports = NicToolbarPlugin
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicToolbarPlugin)
}
