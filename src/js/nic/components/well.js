/**
 * ВВ
 * Usage:
 *
 * <nic-well>
 * ...
 * </nic-well>
 *
 * <nic-well size="small">
 * ..
 * </nic-well>
 *
 * <nic-well title="some">
 * ..
 * </nic-well>
 *
 * @type type
 */

var u = window.u

var NicWell = {
  name: 'nic-well',
  props: {
    size: String, // small
    active: {
      type: String,
      default: 'true'
    },
    title: String
  },
  computed: {
    mainCls: function () {
      var clsArray = [
        'well'
      ]
      if (u.isDef(this.size) && this.size === 'small') {
        clsArray.push('well-sm')
      }
      if (u.isDef(this.title)) {
        clsArray.push('well-with-title')
      }
      return clsArray
    }
  },
  data: function () {
    return {
      isActive: !!(this.active === '' || this.active === 'true')
    }
  },
  methods: {
    renderTitle: function () {
      if (u.isUndef(this.title)) {
        return
      }
      var h = this.$createElement

      return h('span', {
        'class': 'well-title'
      }, [this.title])
    }
  },
  render: function (h) {
    var title = this.renderTitle()

    return h('div', {
      'style': {
        display: this.isActive ? 'block' : 'none'
      },
      'class': this.mainCls
    }, [title, this.$slots.default])
  }
}
var NicWellPlugin = {
  install: function install (Vue) {
    Vue.component('nic-well', NicWell)
  }
}

if (typeof module !== 'undefined') {
  module.exports = NicWellPlugin
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicWellPlugin)
}
