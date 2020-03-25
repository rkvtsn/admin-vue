/**
 * ВВ
 *
 * Usage:
 *
 *  <nic-section ref="sections">
 *      <nic-section-item title="Раздел 1 Подраздел 1" item-key="section-1-subsection-1">
 *          @@include('./sections/section-1-subsection-1.html')
 *      </nic-section-item>
 *      <nic-section-item title="Раздел 1 Подраздел 2" item-key="section-1-subsection-2">
 *          <form>
 *              <input type="text" value="login">
 *              <input type="password" value="password">
 *              <button>Send</button>
 *          </form>
 *      </nic-section-item>
 *  </nic-section>
 *
 *  ..
 *
 *  someFunction: function() {
 *      var sections = this.getComponentByRefs('sections');
 *      section.showSection('section-1-subsection-2'); // other section make hide
 *  }
 *
 *
 */
var nicSections = {
  name: 'nic-section',
  methods: {
    showSection: function (sectionKey) {
      this.$children.map(function (cmp) {
        if (cmp.getKey() === sectionKey) {
          cmp.isActive = true
        } else {
          cmp.isActive = false
        }
      })
    }
  },
  template: '<div class="sections"><slot></slot></div>'
}
var nicSectionItem = {
  name: 'nic-section-item',
  props: {
    title: String,
    active: {
      type: Boolean,
      default: false
    },
    itemKey: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      isActive: this.active
    }
  },
  methods: {
    getKey: function () {
      return this.itemKey
    }
  },
  template: '<div v-show="isActive" class="section"><slot></slot></div>'
}
var NicSectionPlugin = {
  install: function install (Vue) {
    Vue.component('nic-section', nicSections)
    Vue.component('nic-section-item', nicSectionItem) // nic-section-item
  }
}

if (typeof module !== 'undefined') {
  module.exports = NicSectionPlugin
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicSectionPlugin)
}
