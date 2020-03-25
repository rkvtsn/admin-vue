var u = window.u;

var NicTable = {
  name: 'nic-table',
  props: {
    value: {
      type: [Array, Object],
      default: null,
    },
    model: {
      prop: 'value',
      event: 'input',
    },
    hideHeader: Boolean,
    height: String,
    selectable: {
      type: Boolean,
      default: false,
    },
    type: String,
    data: Array,
    columns: Array,
    noSortable: {
      type: Boolean,
      default: false,
    },
    filterKey: String,
    rowRender: {
      type: Function,
      default: function(options, item) {},
    },
    equals: {
      type: Function,
      default: function(v1, v2) {
        return v1 == v2;
      },
    },
  },
  data: function() {
    return {
      tableHeight: u.isDef (this.height) ? 'height:' + this.height : '',
      selectRowIndex: -1,
      sortKey: '',
      sortOrders: {},
    };
  },
  mounted: function() {
    var sortOrders = {};
    this.mainColumns.forEach (function(r) {
      if (u.isObject (r)) {
        sortOrders[r.key] = 1;
      } else {
        sortOrders[r] = 1;
      }
    });
    this.sortOrders = sortOrders;
  },
  computed: {
    isAllChecked() {
      if (!Array.isArray (this.data) || this.data.length === 0) return false;
      for (let x of this.data) {
        if (this.contains (this.value, x) === -1) {
          return false;
        }
      }
      return true;
    },
    hasSortListener() {
      return this.$listeners && this.$listeners.sort;
    },
    mainCls: function() {
      var clsArray = ['table'];
      if (u.isDef (this.type)) {
        clsArray.push (this.type);
      }
      if (u.isDef (this.height)) {
        clsArray.push ('fixed');
      }
      return clsArray.join (' ');
    },
    mainColumns: function() {
      var cols = [];

      if (Array.isArray (this.value) && this.selectable) {
        cols.push ({
          key: '$selection',
          text: '',
        });
      }
      var makeRightColumns = function(recs) {
        for (let i in recs) {
          var col = recs[i];

          if (!u.isObject (col)) {
            cols.push ({
              key: i,
              text: col,
            });
          } else if (u.isDef (col.key)) {
            if (u.isUndef (col.display)) {
              cols.push (col);
            } else if (u.isDef (col.display) && col.display === 'display') {
              cols.push (col);
            }
          } else if (u.isDef (col.columns)) {
            makeRightColumns (col.columns);
          }
        }
      };
      makeRightColumns (this.columns);
      return cols;
    },
    mainData: function() {
      let data = this.data;

      if (!this.hasSortListener) {
        var sortKey = this.sortKey;
        var filterKey = this.filterKey && this.filterKey.toLowerCase ();
        var order = this.sortOrders[sortKey] || 1;

        if (filterKey) {
          data = data.filter (function(row) {
            return Object.keys (row).some (function(key) {
              return String (row[key]).toLowerCase ().indexOf (filterKey) > -1;
            });
          });
        }
        if (sortKey) {
          data = data.slice ().sort (function(a, b) {
            a = a[sortKey];
            b = b[sortKey];
            return (a === b ? 0 : a > b ? 1 : -1) * order;
          });
        }
      }

      return data;
    },
  },
  watch: {
    data: function(value) {
      this.clearSelection ();
    },
  },
  methods: {
    clearSelection() {
      if (!Array.isArray (this.value)) {
        this.$emit ('input', null);
      }
      // if (Array.isArray(this.value))
      //   this.$emit('input', []);
      // else
      //   this.$emit('input', null);
    },
    sortBy: function(columnKey, sortable = true) {
      if (this.noSortable) return;
      if (!sortable) return;
      this.sortKey = columnKey;
      this.sortOrders[columnKey] = this.sortOrders[columnKey] * -1;
      this.clearSelection ();
      this.$emit ('sort', this.sortKey, this.sortOrders[columnKey]);
    },
    renderHeader: function() {
      var that = this;
      var tr = {};
      var rows = [];

      var prepareData = function(treeRecs, deep) {
        var td = [];

        for (let i in treeRecs) {
          var r = treeRecs[i];
          if (!u.isObject (r)) {
            td.push ({
              text: r,
              key: i,
            });
          } else if (u.isDef (r.key)) {
            td.push (r);
          } else if (u.isDef (r.columns)) {
            td.push ({
              text: r.text,
              attrs: u.extend (r.attrs, {
                colspan: u.isDef (r.attrs) && u.isDef (r.attrs.colspan)
                  ? r.attrs.colspan
                  : r.columns.length,
              }),
            });
            prepareData (r.columns, deep + 1);
          }
        }
        if (u.isUndef (tr[deep])) {
          tr[deep] = [];
        }
        tr[deep] = tr[deep].concat (td);
      };
      var renderHeaderRows = function() {
        for (let i in tr) {
          var cols = tr[i];
          var td = [];

          for (let j in cols) {
            var col = cols[j];

            var sortPointerCls = ['sprite', 'sprite-medium'];
            if (u.isUndef (col.attrs)) {
              col.attrs = {};
            }
            if (u.isDef (col.display) && col.display === 'hidden') {
              continue;
            }
            if (u.isDef (col.key) && col.key !== '') {
              if (!that.noSortable) {
                if (that.sortOrders[col.key] > 0) {
                  sortPointerCls.push ('sprite-order-down');
                } else {
                  sortPointerCls.push ('sprite-order-up');
                }
              }
              var sortPointerEl = that.$createElement ('span', {
                class: sortPointerCls.join (' '),
              });
              var thText = that.$createElement (
                'div',
                {
                  class: ['th_text'],
                  style: 'white-space: pre-line',
                },
                [col.text, sortPointerEl]
              );
              (function(c) {
                if (c.key == '$selection') {
                  let selectionCheckbox = that.$createElement ('input', {
                    attrs: {
                      type: 'checkbox',
                      checked: that.isAllChecked,
                    },
                    on: {
                      click(e) {
                        for (let item of that.data) {
                          let index = that.contains (that.value, item);
                          if (!e.target.checked) {
                            that.value.splice (index, 1);
                          } else {
                            if (index === -1) that.value.push (item);
                          }
                        }
                      },
                    },
                    ref: 'selectionCheckboxMain',
                  });

                  td.push (
                    that.$createElement (
                      'th',
                      {
                        attrs: c.attrs,
                        style: {
                          'text-align': 'center',
                        },
                      },
                      [selectionCheckbox]
                    )
                  );
                } else {
                  td.push (
                    that.$createElement (
                      'th',
                      {
                        class: that.sortKey === c.key ? 'active' : '',
                        on: {
                          click: function() {
                            that.sortBy (c.key, c.sortable);
                          },
                        },
                        attrs: c.attrs,
                      },
                      [thText]
                    )
                  );
                }
              }) (col);
            } else {
              td.push (
                that.$createElement (
                  'th',
                  {
                    attrs: col.attrs,
                    style: 'white-space: pre-line',
                  },
                  [col.text]
                )
              );
            }
          }
          rows.push (that.$createElement ('tr', {}, td));
        }
      };
      prepareData (this.mainColumns, 0);
      renderHeaderRows ();
      return this.$createElement (
        'thead',
        {
          class: '',
          style: 'width: 100%',
        },
        rows
      );
    },
    contains(arr, value) {
      if (Array.isArray (arr)) {
        if (arr.length === 0) return -1;
        for (let i = 0; i < arr.length; i++) {
          let x = arr[i];
          if (
            this.equals (x, value) ||
            x === value ||
            (typeof x === 'number' &&
              typeof value === 'number' &&
              isNaN (x) &&
              isNaN (value))
          ) {
            return i;
          }
        }
      }
      return -1;
    },
    renderBody: function() {
      let that = this;

      // TODO: СЛОЖНААА -> упростить!
      function equals(v1, v2) {
        if (Array.isArray (v1)) {
          if (v1.length === 0) return false;
          for (let x of v1) {
            if (!that.equals (x, v2) && !equals (x, v2)) {
              return false;
            }
          }
        } else {
          if (!that.equals (v1, v2)) {
            if (v1 !== v2) {
              if (v1 === null || v2 === null) return false;
            }
            if (v1 !== null && v1 instanceof Object) {
              for (let key of Object.keys (v1)) {
                if (v1[key] !== v2[key] && !equals (v1[key], v2[key])) {
                  return false;
                }
              }
            } else if (v1 !== v2) {
              return false;
            }
          }
        }
        return true;
      }

      let renderBodyRows = function(recs) {
        let tr = [];
        let td = [];

        recs.forEach (function(r, index) {
          if (that.$scopedSlots.default) {
            td = that.$scopedSlots.default (r);
          } else {
            that.mainColumns.forEach (function(c, index) {
              let selectionTag = that.$createElement ('input', {
                domProps: {
                  checked: that.contains (that.value, r) > -1,
                },
                attrs: {
                  type: 'checkbox',
                },
              });
              let isSelection = c.key == '$selection';
              let selectionStyle = isSelection
                ? {
                    'text-align': 'center',
                  }
                : {};

              if (u.isObject (c)) {
                let tdContent = c.expr
                  ? c.expr (r)
                  : String (c.key).indexOf ('.') != -1
                      ? that.$util.getDescendantProp (r, c.key)
                      : r[c.key];

                if (c.format && tdContent !== null) {
                  tdContent = new Date (tdContent).format (c.format);
                }
                let td_render = that.$createElement (
                  'td',
                  {
                    class: c.class,
                    style: Object.assign (selectionStyle, c.style),
                  },
                  isSelection ? [selectionTag] : [tdContent]
                );

                td.push (td_render);
              } else {
                var arr = Object.values (r);
                td.push (
                  that.$createElement ('td', {
                    domProps: {
                      innerHTML: arr[index],
                    },
                  })
                );
              }
            });
          }

          let classValue = equals (that.value, r) ||
            that.contains (that.value, r) > -1
            ? 'selectable selected'
            : that.selectable ? 'selectable' : '';

          let data = {
            // 'class': (that.value === r && !Array.isArray(that.value)) || (Array.isArray(that.value) && that.value.indexOf(r) !== -1) ? 'selectable selected' : (that.selectable) ? 'selectable' : '',
            // 'class': (that.value === r) ? ' selectable selected ' : ' selectable ',
            class: classValue,
            on: {
              click: e => {
                that.$emit ('row-click', r);
                if (!that.selectable) return;

                if (that.value !== null && Array.isArray (that.value)) {
                  let index = that.contains (that.value, r);
                  if (index > -1) {
                    that.value.splice (index, 1);
                  } else {
                    that.value.push (r);
                  }
                } else {
                  if (that.value === r) {
                    that.$emit ('input', null);
                  } else {
                    that.$emit ('input', r);
                  }
                }

                if (!that.hideHeader && that.$refs.selectionCheckboxMain) {
                  that.$refs.selectionCheckboxMain.checked = that.isAllChecked;
                }
              },
            },
          };

          that.rowRender (data, r);
          var row = that.$createElement ('tr', data, td);
          tr.push (row);
          td = [];
        });
        return tr;
      };
      return this.$createElement (
        'tbody',
        {
          class: '',
          style: this.tableHeight,
        },
        [renderBodyRows (this.mainData)]
      );
    },
  },
  render: function(h) {
    let tpl = [this.renderBody ()];
    if (!this.hideHeader) tpl.splice (0, 0, this.renderHeader ());

    return h (
      'table',
      {
        class: this.mainCls,
      },
      tpl
    );
  },
};
var NicTablePlugin = {
  install: function install(Vue) {
    Vue.component ('nic-table', NicTable);
  },
};
if (typeof module !== 'undefined') {
  window.nictable = NicTablePlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use (NicTablePlugin);
}
