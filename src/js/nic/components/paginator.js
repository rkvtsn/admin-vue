/**
 * ВВ
 *
 * Usage
 *
 * <nic-paginator :total-page="totalPage" @goto="gotoPage" v-model="currentPage"></nic-paginator>
 *
 * Usage with table component
 *
 * <nic-table type="table-bordered table-striped" :data="someTableData" :column="someTableColumn">
 * </nic-table>
 * <nic-paginator :total-page="totalPage" @goto="gotoPage" v-model="currentPage"></nic-paginator>
 *
 *
 * @type type
 */

var u = window.u;

var NicPaginator = {
  name: 'nic-paginator',
  props: {
    value: {
      type: [String, Number],
      default: '1',
    },
    totalPage: {
      type: Number,
      default: 1,
    },
    totalElements: {
      type: Number,
      default: null,
    },
    countElements: {
      type: Number,
      default: null,
    },
  },
  methods: {
    goto: function(page) {
      if (page >= 1 && page <= this.totalPage) {
        this.$refs.pageInput = page;
        this.$emit ('goto', page);
      }
    },
    renderStartSprite: function() {
      var that = this;

      return this.$createElement ('span', {
        class: 'sprite sprite-medium sprite-doublepointer-left',
        on: {
          click: function() {
            return that.goto (1);
          },
        },
        attrs: {
          title: 'В начало',
        },
      });
    },
    renderPrevSprite: function() {
      var that = this;

      return this.$createElement ('span', {
        class: 'sprite sprite-medium sprite-pointer-left',
        on: {
          click: function() {
            var value = that.value;
            if (that.value > 1) {
              value--;
            }
            return that.goto (value);
          },
        },
        attrs: {
          title: 'Назад',
        },
      });
    },
    onChangeValue: function(e) {
      var el = e.target;
      var v = parseFloat (el.value);

      if (!isNaN (v)) {
        if (this.value === v) {
          return;
        }
        if (v >= 1 && v <= this.totalPage) {
          this.goto (v);
        } else {
          el.value = this.value;
        }
      } else {
        el.value = this.value;
      }
      this.$emit ('input', e.target.value);
    },
    renderPageInput: function() {
      var that = this;

      that.inputElement = this.$createElement ('input', {
        class: 'form-control',
        domProps: {
          value: this.value,
        },
        on: {
          blur: function(e) {
            that.onChangeValue (e);
          },
          keyup: function(e) {
            if (e && e.key && e.key.toLowerCase () === 'enter') {
              that.onChangeValue (e);
            }
          },
        },
        ref: 'pageInput',
      });
      return that.inputElement;
    },
    renderPageLimit: function() {
      return this.$createElement ('span', {
        domProps: {
          innerHTML: '&nbsp;&nbsp;из&nbsp;' + this.totalPage,
        },
      });
    },
    renderNextSprite: function() {
      var that = this;

      return this.$createElement ('span', {
        class: 'sprite sprite-medium sprite-pointer-right',
        on: {
          click: function() {
            var value = that.value;
            if (that.value < that.totalPage) {
              value++;
            }
            return that.goto (value);
          },
        },
        attrs: {
          title: 'Вперед',
        },
      });
    },
    renderFinishSprite: function() {
      var that = this;

      return this.$createElement ('span', {
        class: 'sprite sprite-medium sprite-doublepointer-right',
        on: {
          click: function() {
            return that.goto (that.totalPage);
          },
        },
        attrs: {
          title: 'В конец',
        },
      });
    },
    renderPagesInfo: function() {
      return this.$createElement ('span', {
        domProps: {
          innerHTML: (this.countElements && this.totalElements) ? `${this.countElements} из ${this.totalElements}` : ''
        },
      });
    },
  },
  render: function(h) {
    var columns = [
      h ('div', {class: 'col col-40'}, [
        this.renderStartSprite (),
        this.renderPrevSprite (),
      ]),
      h ('div', {class: 'col col-80'}, [
        this.renderPageInput (),
        this.renderPageLimit (),
      ]),
      h ('div', {class: 'col col-40'}, [
        this.renderNextSprite (),
        this.renderFinishSprite (),
      ]),
      h ('div', {class: 'col col-80 col-right'}, [this.renderPagesInfo ()]),
    ];
    return h (
      'div',
      {
        class: ['paginator'],
      },
      columns
    );
  },
};
var NicPaginatorPlugin = {
  install: function install(Vue) {
    Vue.component ('nic-paginator', NicPaginator);
  },
};

if (typeof module !== 'undefined') {
  module.exports = NicPaginatorPlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use (NicPaginatorPlugin);
}
