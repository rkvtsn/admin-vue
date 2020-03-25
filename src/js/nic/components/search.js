/**
 * ВВ
 *
 * Usage:
 *
 * <nic-search value="defaultSearchValue" @search="onClickSearchBtn" @search-cancel="onClickSearchCancelBtn">
 * </nic-search>
 *
 * @type type
 */

var NicSearch = {
  name: 'nic-search',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      searchStr: this.value
    }
  },
  watch: {
    searchStr: function (v) {
      if (v === '') {
        this.inputElement.elm.value = v
      }
    }
  },
  methods: {
    getInputValue: function () {
      return this.inputElement.elm.value
    },
    renderSearchBtn: function () {
      var that = this
      var h = this.$createElement

      return h('button', {
        'class': 'btn btn-default',
        on: {
          click: function () {
            that.searchStr = that.getInputValue()
            that.$emit('search', that.searchStr)
          }
        }
      }, [
        h('span', {
          'class': 'sprite sprite-medium sprite-search'
        })
      ])
    },
    renderSearchCancelBtn: function () {
      var that = this
      var h = this.$createElement

      return h('button', {
        'class': 'btn btn-default',
        on: {
          click: function () {

          }
        }
      }, [
        h('span', {
          'class': 'sprite sprite-medium sprite-search-cancel',
          on: {
            click: function () {
              that.searchStr = ''
              that.$emit('search-cancel')
            }
          }
        })
      ])
    }
  },
  render: function (h) {
    var that = this

    var searchBtn = h('span', {
      'class': 'input-group-btn'
    }, [this.renderSearchBtn()])

    var searchCancelBtn = h('span', {
      'class': 'input-group-btn'
    }, [this.renderSearchCancelBtn()])

    var inputField = h('input', {
      'class': 'form-control',
      'attrs': {
        value: that.searchStr
      }
    })
    this.inputElement = inputField

    return h('div', {
      'class': 'input-group search-group'
    }, [searchBtn, inputField, searchCancelBtn])
  }
}
var NicSearchPlugin = {
  install: function install (Vue) {
    Vue.component('nic-search', NicSearch)
  }
}

if (typeof module !== 'undefined') {
  module.exports = NicSearchPlugin
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicSearchPlugin)
}
