<style lang="scss" src="./css/window.scss"></style>

<template>
  <transition name="nic-window"
              v-if="active">
    <div class="nic-window mask">
      <div class="nic-window__wrapper"
           @click.self.stop.prevent="() => (closeable) ? onClose() : null">

        <div class="nic-window__container"
             :style="{height: height, minHeight: minHeight, maxWidth: width}"
             :class="classes">

          <div class="nic-window__header">
            <h4 class="nic-window__title">{{title}}</h4>
            <div @click.stop.prevent="onClose"
                 class="nic-window__btn-close"><i class="sprite sprite-small sprite-close-white"></i></div>
          </div>

          <div class="nic-window__body">
            <div v-if="type == 'dialog'"
                 class="nic-window__icon">
              <span class="sprite sprite-dialog sprite-large"
                    :class="`sprite-${icon}`"></span>
            </div>
            <div class="nic-window__message">
              <slot>
                <div v-if="html"
                     v-html="message"></div>
                <div v-else>{{message}}</div>
              </slot>
            </div>
          </div>

          <div v-if="(buttons && buttons.length) || !!$slots['footer']"
               class="nic-window__footer">
            <div v-if="buttons && buttons.length"
                 class="nic-window__footer-toolbar"
                 :class="{'nic-window__footer-toolbar--center': toolbarCenter}">
              <nic-button v-for="(btn, i) in buttons"
                          :key="i"
                          :text="btn.text"
                          @click.stop.prevent="onClickButton(btn)"></nic-button>
              <slot name="footer">
              </slot>
            </div>

            <div v-else
                 class="nic-window__footer-toolbar"
                 :class="{'nic-window__footer-toolbar--center': toolbarCenter}">
              <slot name="footer"></slot>
            </div>
          </div>

        </div>

      </div>
    </div>
  </transition>
</template>

<script>


/**
 * Компонент модальных окон
 * @example
 * <nic-window :title="Hello"
 *             :active="active">
 *  <template #default>
 *    World!
 *  </template>
 *  <template>
 *    <button @click="active=false">Close!</button>
 *  </template>
 * </nic-window>
 *
 * @param {Boolean} [active=false] - флаг активности (показан/скрыт) окна
 * @param {String} [title=''] - заголовок окна
 * @param {DialogButton[]} [buttons=[]] - массив объектов из кнопок
 * @param {String} [message=''] - текст сообщений
 * @param {Boolean} [html=true] - использовать HTML
 * @param {Boolean} [closeable=true] - закрывать по клику области вокруг
 * @param {Boolean} [toolbarCenter=false] - центрировать панель кнопок
 * @param {String} [width=''] - ширина
 * @param {String} [height=''] - высота
 * @param {(info|warning|question|error)} [icon=''] - иконка (префикс спрайта)
 * @param {(normal|large|small|dialog)} [type='normal'] - тип окна ['normal', 'large', 'small', 'dialog']
 *
 */
export default {

  name: 'nic-window',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    buttons: {
      type: Array,
      default: () => []
    },
    message: {
      type: String,
      default: ''
    },
    html: {
      type: Boolean,
      default: true
    },
    closeable: {
      type: Boolean,
      default: true
    },
    toolbarCenter: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'normal'
    }
  },

  watch: {
    active(v) {
      if (v) {
        this.$emit('show');
      } else {
        this.$emit('hide');
      }
    }
  },

  computed: {
    classes() {
      return `nic-window__container--${this.type}`;
    }
  },


  methods: {

    onClickButton(btn) {
      this.$emit('before-button-click', this);
      btn.click(this.onClose, this);
      this.$emit('button-click', this);
    },

    onClose() {
      this.$emit('before-close', this);
      this.close(() => {
        this.$nextTick(() => {
          this.$emit('after-close', this);
        });
      });
      // this.$emit('close', this);
    },

    close(f = () => { }) {
      // TODO: this.$emit('input', false);
      this.$emit('close', this);
      f();
    }

  },

  install(Vue) {
    Vue.component('nic-window', this);

    let NicDialog = Vue.extend(NicDialogWindow);
    let dialog = new NicDialog();

    var vm = dialog.$mount();
    document.querySelector('body').appendChild(vm.$el);

    /**
     * @method showMessage
     * @member Vue
     */
    Vue.prototype.showMessage = dialog.showMessage;
    Vue.showMessage = dialog.showMessage;
    window.showMessage = dialog.showMessage;

    /**
     * @method showMessageError
     * @member Vue
     * @param {DialogMessage} params - параметры диалогового окна
     */
    Vue.prototype.showMessageError = (message, params = {}) => {
      params.message = message;
      params.icon = 'error';
      if (!params.title) params.title = 'Ошибка';
      if (!params.buttons) {
        params.buttons = [{ text: 'Закрыть', click(d, ctx) { d(); } }];
      }
      dialog.showMessage(params);
    };
    // Vue.showMessageError()

    /**
     * @method showMessageError
     * @member Vue
     * @param {DialogMessage} params - параметры диалогового окна
     */
    Vue.prototype.showMessageWarning = (message, params = {}) => {
      params.message = message;
      params.icon = 'warning';
      if (!params.title) params.title = 'Предупреждение';
      if (typeof params.toolbarCenter === 'undefined') {
        params.toolbarCenter = true;
      }
      if (!params.buttons) {
        params.buttons = [{ text: 'OK', click(d, ctx) { d(); } }];
      }
      dialog.showMessage(params);
    };

    /**
     * @method showMessageInfo
     * @member Vue
     * @param {DialogMessage} params - параметры диалогового окна
     */
    Vue.prototype.showMessageInfo = (message, params = {}) => {
      params.message = message;
      params.icon = 'info';
      if (!params.title) params.title = 'Информация';
      if (!params.buttons) {
        params.buttons = [{ text: 'Закрыть', click(d, ctx) { d(); } }];
      }
      dialog.showMessage(params);
    };

    /**
     * @method showMessageConfirm
     * @member Vue
     * @param {DialogMessage} params - параметры диалогового окна
     * @param {Function} ok - функция callback для согласия
     * @param {Function} cancel - функция callback для CANCEL
     */
    Vue.prototype.showMessageConfirm = (message, ok = null, cancel = null, params = {}) => {
      params.message = message;
      params.icon = 'question';
      if (!params.title) params.title = 'Подтверждение действия';
      if (!params.buttons) {
        params.buttons = [
          { text: 'Да', click(d, ctx) { if (ok) ok(d, ctx); else d(ctx); } },
          { text: 'Нет', click(d, ctx) { if (cancel) cancel(d, ctx); else d(); } }
        ];
      }
      dialog.showMessage(params);
    };

  }

};


/**
 * DialogButton
 * @typedef DialogButton
 * @property {String} text
 * @property {Function} click
 */

/**
 * DialogMessage - параметр диалоговых сообщений
 * @typedef DialogMessage
 * @property {String} message - сообщение
 * @property {String} text - @deprecated
 * @property {String} title - заголовок
 * @property {(String|info|warning|question|error)} icon - иконка (префикс спрайта)
 * @property {Boolean} closeble - закрытие при клике вне области окна
 * @property {DialogButton[]} buttons - кнопки в тулбаре
 * @property {Boolean} toolbarCenter - центрирование тулбара с кнопками
 */


/**
 * Модальное окно
 * @param [title='']
 * @param [message='']
 * @param [icon='']
 * @param [buttons=[]]
 * @param [active=false]
 * @param [closeable=true]
 * @param [html=true]
 * @param [toolbarCenter=false]
 */
const NicDialogWindow = {

  data() {
    return {
      title: '',
      message: '',
      icon: '',
      buttons: [],
      active: false,
      closeable: true,
      html: true,
      toolbarCenter: false
    };
  },

  methods: {
    /**
     * Показать модальное диалоговое окно
     * @example
     * this.showMessage({
     *  title: 'Hello',
     *  message: 'World',
     *  html: false,
     *  buttons: [{ text: 'Закрыть', click(d, ctx) { d(); } }],
     *  toolbarCenter: true
     * })
     * @param {DialogMessage}
     */
    showMessage({ message = '', text = '', title = '', icon = 'info', closeable = true, buttons = [], toolbarCenter = false, html = true } = {}) {
      this.active = true;
      this.message = message || text; // Не понимаю зачем API showMessage и NicWindow используют разные переменные...
      if (text !== '') {
        console.log('Warning! Параметр `text` в методе `showMessage` запрещен и будет удален');
      }
      this.title = title;
      this.icon = icon;
      this.closeable = closeable;
      this.buttons = buttons;
      this.html = html;
      this.toolbarCenter = toolbarCenter;
    }

  },

  template: `
    <nic-window type="dialog"
                :active="active"
                :closeable="closeable"
                :buttons="buttons"
                :message="message"
                :title="title"
                :icon="icon"
                :html="html"
                :toolbar-center="toolbarCenter"
                @close="active = false"></nic-window>
  `

};
</script>

