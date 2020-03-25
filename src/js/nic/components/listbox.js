var u = window.u;

var NicListbox = {
  name: 'nic-listbox',
  props: {
    sourceCols: Array,
    sourceData: Array,
    destCols: Array,
    destData: Array,
    onSelectSourceRow: Function,
    onSelectDestRow: Function,
    onClickAddBtn: Function,
    onClickDelBtn: Function,
    onClickAddAllBtn: Function,
    onClickDelAllBtn: Function,
    height: String,
  },
  data: function() {
    return {
      hasOnSelectSourceRowHandler: u.isDef(this.onSelectSourceRow),
      hasOnSelectDestRowHandler: u.isDef(this.onSelectDestRow),
      hasOnClickAddBtnHandler: u.isDef(this.onClickAddBtn),
      hasOnClickDelBtnHandler: u.isDef(this.onClickDelBtn),
      hasOnClickAddAllBtnHandler: u.isDef(this.onClickAddAllBtn),
      hasOnClickDelAllBtnHandler: u.isDef(this.onClickDelAllBtn),
      tableHeight: u.isDef(this.height) ? this.height : '300px'
    };
  },
  methods: {
    
  },
  template: '<div class="row listbox">'+
      '<div class="col col-lg-12">'  +
        '<table style="width:100%">'+
          '<tr valign="top">'+
            '<td width="45%">'+
              '<slot name="sourceHeader"></slot>'+
            '</td>'+            
            '<td>'+
            '</td>'+            
            '<td width="45%">'+
              '<slot name="destHeader"></slot>'+
            '</td>'+
          '</tr>'+
          '<tr valign="top">'+          
            '<td>'+
              '<nic-table :height="tableHeight" :columns="sourceCols" :data="sourceData" type="table-bordered" selectable="selectable" @row-click="onSelectSourceRow"></nic-table>'+
            '</td>'+            
            '<td valign="middle" align="center">'+
                '<div v-if="hasOnClickAddBtnHandler"><button type="button" class="btn btn-default btn-sprite" v-on:click="onClickAddBtn"><span class="sprite sprite-small sprite-carret-right"></span></button></div>' +
                '<div v-if="hasOnClickDelBtnHandler"><button type="button" class="btn btn-default btn-sprite" v-on:click="onClickDelBtn"><span class="sprite sprite-small sprite-carret-left"></span></button></div>' +
                '<div v-if="hasOnClickAddAllBtnHandler"><button type="button" class="btn btn-default btn-sprite" v-on:click="onClickAddAllBtn"><span class="sprite sprite-small sprite-max-right"></span></button></div>' +
                '<div v-if="hasOnClickDelAllBtnHandler"><button type="button" class="btn btn-default btn-sprite" v-on:click="onClickDelAllBtn"><span class="sprite sprite-small sprite-max-left"></span></button></div>' +
            '</td>'+            
            '<td>'+
              '<nic-table :height="tableHeight" :columns="destCols" :data="destData" type="table-bordered" selectable="selectable" @row-click="onSelectDestRow"></nic-table> '+
            '</td>'+                      
          '</tr>'+
        '</table>'+
      '</div>'+
    '</div>'
};
var NicMenuPlugin = {
  install: function install (Vue) {
    Vue.component('nic-listbox', NicListbox);
  }
}
if (typeof module !== 'undefined') {
  module.exports = NicMenuPlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicMenuPlugin);
}
