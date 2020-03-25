/**
 *
 * ВВ
 *
 * Usage:
 *
 * <nic-panel>
 *      <nic-panel-header>
 *          ...
 *      </nic-panel-header>
 *      <nic-panel-body>
 *          ...
 *      </nic-panel-body>
 *      <nic-panel-footer>
 *          ...
 *      </nic-panel-footer>
 * </nic-panel>
 *
 * @type type
 */

var u = window.u

var NicPanel = {
  name: 'nic-panel',
  props: {
    type: String
  },
  computed: {
    mainCls: function () {
      var clsArray = [
        'panel'
      ]
      if (u.isDef(this.type)) {
        clsArray.push(this.type)
      } else {
        clsArray.push('panel-default')
      }
      return clsArray.join(' ')
    }
  },
  template: '<div :class="mainCls"><slot></slot></div>'
}
var NicPanelHeader = {
  name: 'nic-panel-header',
  props: {
    text: String
  },
  template: '<div class="panel-heading"><slot></slot></div>'
}
var NicPanelFooter = {
  name: 'nic-panel-footer',
  template: '<div class="panel-footer"><slot></slot></div>'
}
var NicPanelBody = {
  name: 'nic-panel-body',
  template: '<div class="panel-body"><slot></slot></div>'
}
var NicPanelPlugin = {
  install: function install (Vue) {
    Vue.component('nic-panel', NicPanel) // не очевидное название 'p-**'
    Vue.component('nic-panel-header', NicPanelHeader)
    Vue.component('nic-panel-body', NicPanelBody)
    Vue.component('nic-panel-footer', NicPanelFooter)
  }
}

if (typeof module !== 'undefined') {
  module.exports = NicPanelPlugin
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicPanelPlugin)
}
