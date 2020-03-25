(function() {
  "use strict";

  /**
   * Usage
   *
   *  <nic-breadcrumb v-on:click="onClickBreadCrumbItem">
   *    <nic-breadcrumb-item key="breadcrumb.key" v-for="breadcrumb in breadcrumbList" v-bind:itemkey="breadcrumb.key">{{breadcrumb.text}}</nic-breadcrumb-item>
   *  </nic-breadcrumb>
   *
   *  var app = new Vue({
   *    data: {
   *      breadcrumbs: [{
   *        key: 'root',
   *        text: 'В начало'
   *      },
   *      {
   *        cmp: 'assigned-personal-don'
   *        key: 'start',
   *        text: 'Учет назначенного персонала'
   *      },
   *      {
   *        cmp: 'assigned-personal-don-view'
   *        key: 'edit',
   *        text: 'Изменение назначенной персоны'
   *      }]
   *    }
   *  });
   *
   *  Notes:  Ссылку на последний элемент не рисует
   *
   * in ur components or modules u need:
   *
   *  @example
   *  data.actionList: {
   *    start: {
   *      key: 'start',
   *      text: 'Учет назначенного персонала ДОН'
   *    },
   *    add: {
   *      key: 'add',
   *      text: 'Добавление воздуха'
   *    }
   *  }
   *  mounted() {
        this.action('start');
      }
   *  methods.action(v, cmp = this.$options.name){
   *    this.$emit('action', cmp, isString(v) ? this.actionList[v] : v);
   *  }
   *  methods.onAction(cmp, action) {
   *    //... insert here something special actions
   *    this.action(action, cmp);
   *  }
   *  // if u use this.currentAction, then u need write
   *  methods.onClickBreadcrumb(item) {
        this.currentAction = item.getKey();
      }
   *
   *  <module>
   *    <nic-breadcrumb :isolate="false" @click="onClickBreadcrumb"></nic-breadcrumb>
   *    <list-component @action="onAction"></list-component>
   *    <view-component @action="onAction"></view-component>
   *  </module>
   *
   */

  var NicBreadcrumb = {
    name: 'nic-breadcrumb',
    props: {
      isolate: { type: Boolean, default: true }
    },
    data() {
      return {
        data: this.$root.breadcrumbs
      }
    },
    computed: {
      mainCls: function() {
        var clsArray = [
          'breadcrumb'
        ];
        return clsArray.join(' ')
      }
    },
    methods: {
      click: function(item) {
        if ( !this.isolate ) {
          if ( item.getKey() !== 'index' )
            this.data.splice(this.data.lastIndexOfKey([{ key: item.getKey() }, { cmp: item.cmp }]));
          else
            this.data.splice(1);
        }
        this.$emit('click', item);
        this.$root.$emit('breadcrumb-click', item);
      }
    },
    template: `
      <ul class="breadcrumbs" :class="mainCls">
        <slot>
          <nic-breadcrumb-item v-for="crumb in this.data" :cmp="crumb.cmp" :key="crumb.key" :itemkey="crumb.key"
          >{{crumb.text}}</nic-breadcrumb-item>
        </slot></ul>
    `
  };
  var NicBreadcrumbItem = {
    name: 'nic-breadcrumb-item',
    props: {
      cmp: {
        type: String,
        default: ''
      },
      itemkey: {
        type: String,
        default: ''
      },
      hasLink: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {}
    },
    methods: {
      getKey: function() {
        return this.itemkey
      },
      onClick: function() {
        this.$parent.click(this)
      }
    },
    template: '<li v-if="hasLink">' +
    '<a @click.prevent="onClick"><slot></slot></a>' +
    '</li>' +
    '<li v-else>' +
    '<slot></slot>' +
    '</li>'
  };
  var NicNavbarPlugin = {
    install: function install(Vue) {
      Vue.component('nic-breadcrumb', NicBreadcrumb)
      Vue.component('nic-breadcrumb-item', NicBreadcrumbItem)
    }
  };
  if ( typeof module !== 'undefined' ) {
    module.exports = NicNavbarPlugin
  }
  else if ( typeof window !== 'undefined' && window.Vue ) {
    window.Vue.use(NicNavbarPlugin)
  }
})();
