<style lang="scss" src="./styles/nic-form.scss"></style>

<template>
  <form class="NicForm"
        :class="{'NicForm-newline': isNewline}"
        @submit.stop.prevent="$emit('submit')">

    <slot name="header">
      <div class="NicForm__Caption">{{title}}</div>
    </slot>

    <div class="NicForm__Body"
         ref="body"
         :class="{'NicForm__Body-autoheight': autoheight, 'NicForm__Body-overflow': isRendered && autoheight}"
         :style="{height: bodyHeight, 'overflow-x': (overflowX) ? 'auto' : ''}">
      <slot></slot>
    </div>

    <div class="NicForm__Footer">
      <div class="NicForm__BottomToolbar"
           v-if="bottomToolbar">
        <slot name="footer">
          <button v-if="validation && !readonly"
                  class="btn btn-primary"
                  type="submit"
                  :disabled="isLoading || (validation && !validation.isValid)">
            Сохранить
          </button>
          <button v-else-if="!readonly"
                  class="btn btn-primary"
                  type="submit">Сохранить</button>
          <button class="btn btn-default"
                  type="submit"
                  @click.stop.prevent="cancel">Отмена</button>
        </slot>
      </div>
      <div v-else
           class="NicForm__BottomToolbar">
        <slot name="footer"></slot>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
.NicForm {
  &__Body {
    z-index: 100;
  }

  &__Body-autoheight {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  &__Body-overflow {
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__Footer {
    width: 100%;
    // right: 0;
    // bottom: 0;
    z-index: 110;
    // display: inline-block;
    // position: fixed;
    height: 40px;
    // padding: 10px;
    // background: #fff;
    .NicForm__BottomToolbar {
      margin-top: 10px;
    }
  }
}
</style>

<script>
export default {
  name: 'nic-form',
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    autoheight: {
      type: Boolean,
      default: true
    },
    overflowX: {
      type: Boolean,
      default: false
    },
    title: '',
    autocomplete: {
      type: String,
      default: 'off'
    },
    newline: Boolean,
    validation: {
      type: [Object, Array],
      default: () => null
    },
    bottomToolbar: { default: true }
  },

  data() {
    return {
      bodyHeight: '',
      isRendered: false
    };
  },

  mounted() {
    this.init();
  },

  computed: {
    isNewline() {
      return this.newline;
    }
  },

  methods: {
    init() {
      this.staticHeight = 0;
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.autoheight) {
            window.addEventListener('resize', () => {
              this.calcFormBody();
            });
            this.calcFormBody();
          }
        });
      }, 200);
    },

    cancel(event) {
      if (this.validation) {
        if (isArray(this.validation)) {
          this.validation.forEach(x => x.$clear());
        } else {
          this.validation.$clear();
        }
      }
      this.$emit('cancel', event);
    },

    calcFormBody() {
      if (this.isLoading) {
        return this.init();
      }

      this.isRendered = false;
      return this.$nextTick(() => {
        let w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          y = w.innerHeight || e.clientHeight || g.clientHeight;

        if (!this.staticHeight)
          this.staticHeight =
            document.getElementsByTagName('body')[0].offsetHeight - ((this.$refs.body) ? this.$refs.body.scrollHeight : document.getElementsByClassName('NicForm__Body')[0].scrollHeight);

        this.bodyHeight = (y - this.staticHeight) + 'px';

        this.isRendered = true;
      });
    },


  },

};
</script>
