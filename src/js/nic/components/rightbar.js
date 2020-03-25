
var NicContent = {
  name: 'nic-content',
  computed: {
    hasRightbar: function () {
      return this.$slots.rightbar
    },
    contentClass: function () {
      return (this.hasRightbar) ? 'nic-content' : ''
    }
  },
  template:
  '<div :class="contentClass">' +
    '<slot></slot>' +
    '<div v-if="hasRightbar" class="sidebar rightbar col-sm-3 col-md-2">' +
      '<slot name="rightbar"></slot>' +
    '</div>' +
  '</div>'
}

var NicRightbar = {
  name: 'nic-rightbar',
  computed: {
    hasBody: function () {
      return this.$slots.body
    },
    hasCaption: function () {
      return this.$slots.caption
    }
  },
  template:
  '<div class="rightbar_body rightbar_body-default">' +
    '<slot>' +
      '<div class="rightbar_body__caption">Выберите элемент для отображения</div>' +
    '</slot>' +
  '</div>'
}

var NicAppPlugin = {
  install: function install (Vue) {
    Vue.component(NicContent.name, NicContent)
    Vue.component(NicRightbar.name, NicRightbar)
  }
}

if (typeof module !== 'undefined') {
  module.exports = NicAppPlugin
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicAppPlugin)
}
