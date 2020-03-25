/**
 * ВВ
 *
 * Usage:
 *
 * <nic-menu @item-click="userDefineFunction">
 *      <nic-menu-item v-bind:active="item.active" v-bind:key="item.uid" v-bind:item-key="item.key" v-for="item in mainMenu">{{item.name}}</nic-menu-item>
 * </nic-menu>
 *
 * or
 *
 * <nic-menu @item-click="userDefineFunction">
 *      <nic-menu-item item-key="section-1" active>Пункт один</nic-menu-item>
 *      <nic-menu-item item-key="section-2">Пункт два</nic-menu-item>
 * </nic-menu>
 *
 * new Vue({
 *  data: {
 *      mainMenu: [{
 *          uid: 1,
 *          name: 'Что то',
 *          key: 'some'
 *      },{
 *          uid: 2,
 *          name: 'Что то 2',
 *          key: 'some-2'
 *      }]
 *  }
 *
 * ..
 *
 * userDefaineFunction: function(item) {
 *      console.log(item.getKey(), item.getName());
 * }
 *
 * @type type
 */

var u = window.u;

var NicMenu = {
  name: 'nic-menu',
  computed: {
    mainCls: function () {
      var clsArray = [
        'menu'
      ]
      return clsArray.join(' ')
    }
  },
  methods: {
    click: function (item) {
      this.$emit('item-click', item)
    },
    getItems: function () {
      if (this.$slots.default) {
        var slots = this.$slots.default
        var list = []

        for (var i in slots) {
          var el = slots[i]

          if (u.isDef(el.componentInstance)) {
            list.push(el.componentInstance)
          }
        }
        return list
      } else {
        return []
      }
    },
    getItemByName: function (name) {
      var items = this.getItems()

      for (var i in items) {
        var item = items[i]

        if (item.getName() === name) {
          return item
        }
      }
    },
    deselect: function () {
      this.$children.map(function (cmp) {
        cmp.deselect()
      })
    },
    selectByKey: function (key) {
      var that = this

      this.$children.map(function (cmp) {
        if (cmp.getKey() === key) {
          that.deselect()
          cmp.select()
        }
      })
    },
    selectByName: function (name) {
      var that = this

      this.$children.map(function (cmp) {
        if (cmp.getName() === name) {
          that.deselect()
          cmp.select()
        }
      })
    }
  },
  template: '<ul :class="mainCls"><slot></slot></ul>'
}
var NicMenuItem = {
  name: 'nic-menu-item',
  props: {
    tooltip: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      dafault: false
    },
    sprite: String,
    type: {
      type: String,
      default: 'item' // type="separator" || type="item"
    },
    active: {
      type: Boolean,
      dafault: false
    },
    itemKey: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      isDisabled: this.disabled,
      isActive: this.active,
      isSeparator: this.type === 'separator'
    }
  },
  methods: {
    click: function (e) {
      this.$parent.deselect()
      this.select()
      this.$parent.click(this)
    },
    enable: function () {
      this.isDisabled = false
    },
    disable: function () {
      this.isDisabled = true
    },
    select: function () {
      this.isActive = true
    },
    deselect: function () {
      this.isActive = false
    },
    getName: function () {
      if (u.isDef(this.$slots.default)) {
        return this.$slots.default[0].text
      } else {
        return ''
      }
    },
    getKey: function () {
      return this.itemKey
    },
    renderName: function () {
      var name = this.getName()

      if (name !== '') {
        var h = this.$createElement

        return h('span', {
          'class': 'text'
        }, [name])
      } else {
        return ''
      }
    },
    renderSprite: function () {
      if (u.isUndef(this.sprite)) {
        return
      }
      var h = this.$createElement

      return h('span', {
        'class': ['sprite', this.sprite]
      })
    },
    renderLink: function () {
      if (this.isSeparator) {
        return
      }
      var h = this.$createElement
      var sprite = this.renderSprite()
      var name = this.renderName()

      return h('a', {
        'on': {
          click: this.click
        },
        'attrs': {
          'item-key': this.itemKey,
          title: this.tooltip,
          href: 'javascript:;'
        }
      }, [sprite, name])
    }
  },
  render: function (h) {
    var link = this.renderLink()

    return h('li', {
      'class': {
        'disabled': this.isDisabled,
        'active': this.isActive,
        'separator': this.isSeparator
      }
    }, [link])
  }
}
var NicMenuPlugin = {
  install: function install (Vue) {
    Vue.component('nic-menu', NicMenu)
    Vue.component('nic-menu-item', NicMenuItem)
  }
}

if (typeof module !== 'undefined') {
  module.exports = NicMenuPlugin
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicMenuPlugin)
}
