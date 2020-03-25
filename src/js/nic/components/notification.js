var NicNotifyBell = {
  name: 'nic-notify-bell'
};

var NicNotify = {
  data: function() {
    return {
      types: {
        info: { itemClass: 'notify-item-info', iconClass: 'sprite sprite-medium sprite-question-blue' },
        error: { itemClass: 'notify-item-danger', iconClass: 'sprite sprite-medium sprite-close-red' },
        warning: { itemClass: 'notify-item-warning', iconClass: 'sprite sprite-medium sprite-warning' },
        success: { itemClass: 'notify-item-success', iconClass: 'sprite sprite-medium sprite-ok' }
      },
      options: {
        itemClass: 'notify-item',
        duration: 500,
        visibility: 2000,
        position: 'top-right',
        closeButtonClass: 'close',
        width: '300px',
        mode: 'text',
        permanent: false
      },
      items: {},
      idx: 0
    };
  },
  computed: {
    width: function() {
      if (this.options.position === 'top-full' || this.options.position === 'bottom-full') {
        return 'auto';
      } else {
        return this.options.width;
      }
    }
  },
  methods: {
    setTypes: function(types) {
      this.types = types;
    },
    addItem: function(type, msg, options) {
      if (typeof msg !== 'string' && !(msg instanceof String)) {
        for (let msgKey of ['messageError', 'errorMessage', 'message']) {
          if (msgKey in msg) msg = msg[msgKey];
        }
      }
      var defaultOptions = {
        iconClass: this.types[type].iconClass,
        itemClass: [this.options.itemClass, this.types[type].itemClass],
        visibility: this.options.visibility,
        mode: this.options.mode,
        closeButtonClass: this.options.closeButtonClass,
        permanent: this.options.permanent
      };

      var itemOptions = Object.assign({}, defaultOptions, options);
      var idx = this.idx;

      this.$set(this.items, this.idx, { type: type, text: msg, options: itemOptions });

      this.idx++;
      var that = this;
      if (itemOptions.permanent === false) {
        setTimeout(function() { that.removeItem(idx); }, that.options.duration + itemOptions.visibility);
      }
    },
    removeItem: function(index) {
      this.$delete(this.items, index);
    },
    removeAll: function() {
      this.items = {};
    }
  },
  template: '<div :class="\'notify-\' + options.position" class="notify">' +
  '<transition-group name="notify" tag="div">' +
    '<div v-for="(item, key) in items" :key="key" class="notify-wrapper">' +

      '<div :class="item.options.itemClass">' +
        '<div class="notify-icon" v-if="item.options.iconClass"><span :class="item.options.iconClass"></span></div>' +
        '<div class="notify-text" v-if="item.options.mode === \'html\'" v-html="item.text"/>' +
        '<template v-else><div class="notify-text">{{ item.text }}</div></template>' +
        '<button v-if="item.options.closeButtonClass" :class="item.options.closeButtonClass"' +
                'type="button"' +
                'aria-label="Close"' +
                '@click="removeItem(key)">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</transition-group>' +
'</div>'
};

var NicNotificationPlugin = {
  install: function install(Vue, options = {}) {
    Vue.component(NicNotifyBell.name, NicNotifyBell);
    var Constr = Vue.extend(NicNotify);
    var Notify = new Constr();
    // Apply configuration
    Notify.options = Object.assign(Notify.options, options);

    var vm = Notify.$mount();
    document.querySelector('body').appendChild(vm.$el);

    Vue.$notify = Vue.prototype.$notify = function(msg, type = 'info', options = {}) {
      Notify.addItem(type, msg, options);
    };

    Vue.$notify.info = Vue.prototype.$notify.info = function(msg, options = {}) {
      Notify.addItem('info', msg, options);
    };

    Vue.$notify.success = Vue.prototype.$notify.success = function(msg, options = {}) {
      Notify.addItem('success', msg, options);
    };

    function error(msg, options = {}) {
      Notify.addItem('error', msg, options);
    }
    Vue.$notify.error = Vue.prototype.$notify.error = Vue.$notify.danger = Vue.prototype.$notify.danger = error;

    Vue.$notify.warning = Vue.prototype.$notify.warning = function(msg, options = {}) {
      Notify.addItem('warning', msg, options);
    };

    Vue.$notify.setTypes = Vue.prototype.$notify.setTypes = function(types) {
      Notify.setTypes(types);
    };
    Vue.$notify.removeAll = Vue.prototype.$notify.removeAll = function() {
      Notify.removeAll();
    };
  }
};

if (typeof module !== 'undefined') {
  window.nicnotification = NicNotificationPlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicNotificationPlugin);
}
