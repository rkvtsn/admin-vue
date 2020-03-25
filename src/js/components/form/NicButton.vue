<style lang="scss" scoped>
@import "../../../css/theme/white/colors.scss";
@import "../../../css/theme/white/variables.scss";
@import "../../../css/_singletons.scss";

.nic-button {
  display: inline-flex;
  @extend .not-selectable;

  a,
  button {
    @extend .flexbox-row;
    align-items: center;
    align-content: center;
    justify-content: center;
  }

  .btn {
    padding: 0;

    &:hover {
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
      border-image-source: linear-gradient(to top, #496b80, #7097af);
      border-image-slice: 1;
      background-image: linear-gradient(to top, #cccdd0, #e3e5e8),
        linear-gradient(to top, #496b80, #7097af);
      background-origin: border-box;
      background-clip: content-box, border-box;
    }

    &.split {
      display: inline-flex;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      &.no-separator {
        display: none;
      }
    }
  }

  + .nic-button {
    margin-left: 5px;
  }

  .text {
    height: 100%;
    vertical-align: middle;
    width: auto;
    padding-right: 10px;
    padding-left: 10px;
    line-height: 30px;
    display: inline-block;
  }

  .sprite + .text {
    padding-left: 0;
  }

  .md-menu {
    display: inline-flex;

    .splitter {
      @extend .flexbox-row;
      align-items: center;
      min-height: 100%;
      line-height: 28px;
      margin-left: 0;

      &.btn {
        width: 20px;
        min-width: 20px;
        height: 30px;
        display: flex;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;

        &.no-separator {
          width: auto;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          display: inline-flex;
          border-left-style: solid;
        }

        .sprite-pointer-down,
        .sprite-pointer-down-hover {
          height: 28px;
          background-position-y: 4px;
        }
      }

      .separator {
        display: inline-block;
        cursor: pointer;
        height: 100%;
        line-height: 30px;
        width: 0;
        border-left: solid 1px $button-border;
      }
    }
  }
}

.nic-button.has-icon + .nic-button.hasnot-icon {
  position: relative;
  top: -11px;
}
</style>

<template>
  <div class="nic-button"
       :class="{'disabled': disabled, 'hasnot-icon': !icon, 'has-icon': icon}">
    <button :disabled="disabled"
            v-if="type==='submit'"
            type="submit"
            class="btn btn-primary"
            v-tooltip="tooltip"
            @click="$emit('click', $event)">
      <slot name="icon"
            v-if="icon">
        <span class="sprite"
              :class="[`sprite-${size}`,icon.indexOf('sprite-')>-1? icon : `sprite-${icon}`]"></span>
      </slot>
      <span class="text"
            v-if="text">{{text}}</span>
    </button>

    <button :disabled="disabled"
            v-if="type==='reset'"
            type="reset"
            class="btn btn-default"
            v-tooltip="tooltip"
            @click="$emit('click', $event)">
      <slot name="icon"
            v-if="icon">
        <span class="sprite"
              :class="[`sprite-${size}`,icon.indexOf('sprite-')>-1? icon : `sprite-${icon}`]"></span>
      </slot>
      <span class="text"
            v-if="text">{{text||'Сбросить'}}</span>
    </button>

    <button v-if="type==='button'"
            class="btn btn-default"
            :class="[{split: $attrs.split!==undefined},{'no-separator': $attrs['no-separator']!==undefined}]"
            :disabled="disabled"
            v-tooltip="tooltip"
            @click="$emit('click', $event)">
      <slot name="icon"
            v-if="icon">
        <span class="sprite"
              :class="[`sprite-${size}`,icon.indexOf('sprite-')>-1? icon : `sprite-${icon}`]"></span>
      </slot>
      <span class="text"
            v-if="text">{{text}}</span>
    </button>

    <md-menu md-direction="bottom-start"
             v-if="$attrs.split!==undefined">
      <button md-menu-trigger
              v-if="$attrs.split!==undefined"
              class="btn btn-default splitter"
              :class="{'no-separator': $attrs['no-separator']!==undefined}"
              @mouseover="onHoverSplitter"
              @mouseleave="onLeaveSplitter">

        <div v-if="$attrs['no-separator']!==undefined"
             class="no-separator">
          <slot name="icon"
                v-if="icon">
            <span class="sprite"
                  :class="[`sprite-${size}`,icon.indexOf('sprite-')>-1? icon : `sprite-${icon}`]"></span>
          </slot>
          <span class="text"
                v-if="text">{{text}}</span>
        </div>

        <span class="sprite sprite-medium sprite-pointer-down"></span>
      </button>
      <md-menu-content>
        <md-menu-item v-for="(item,i) in items"
                      :key="i"
                      @click="item.click"
                      :disabled="item.disabled || disabled">
          <span v-if="item.icon"
                class="sprite sprite-large"
                :class="[(item.icon||'').indexOf('sprite-')>-1? item.icon : `sprite-${item.icon}`]"></span>
          {{item.text}}
        </md-menu-item>
      </md-menu-content>
    </md-menu>

    <a v-if="type==='a'"
       v-tooltip="tooltip"
       @click="$emit('click', $event)">
      <slot name="icon"
            v-if="icon">
        <span class="sprite"
              :class="[`sprite-${size}`,icon.indexOf('sprite-')>-1? icon : `sprite-${icon}`]"></span>
      </slot>
      <span class="text"
            v-if="text">{{text}}</span>
    </a>

    <a v-if="type==='expander'"
       type="expander"
       class="nic-button"
       v-tooltip="tooltip"
       @click.stop.prevent="expand = !expand;$emit('click', $event);">
      Расширенный поиск
      <i class="sprite sprite-medium"
         :class="[expanded? 'sprite-pointer-down' : 'sprite-pointer-right']"></i>
    </a>
  </div>
</template>

<script>
import NicFormComponentMixin from "./mixins/NicFormComponentMixin";


/**
 * @class components.nic.form.NicButton
 *
 *  @example
 *  <!-- with separator in SplitButton -->
 *  <nic-button split
 *      text="Base click"
 *      :items="[
 *        {
 *          text: 'first',
 *          click(){console.log('click first')}
 *        }
 *      ]"
 *  />
 *  <!-- without separator in SplitButton -->
 *  <nic-button split no-separator
 *      text="Base click"
 *      :items="[
 *        {
 *          text: 'first',
 *          icon: 'bell',
 *          click(){console.log('click first')}
 *        }
 *      ]"
 *  />
 *
 */
export default {
  mixins: [NicFormComponentMixin],
  install(Vue) {
    Vue.component('nic-button', this);
  },

  props: {
    /**
     * Items for popup menu items.
     * @property {[{text: String, click: Function, icon: String}]} [items=[]]
     */
    items: { type: Array, default() { return []; } },
    disabled: { type: Boolean, default: false },
    text: { default: '' },
    /**
     * @property {'large'|'medium'|'small'} [size='large']
     */
    size: { default: 'large' },
    icon: { default: '' },
    /**
     * @property {'button'|'submit'|'reset'|'a'|'expander'} [type='button']
     */
    type: {
      type: String,
      default: 'button'
    },
    expanded: { type: Boolean, default: false },
    tooltip: {
      type: [Object, String],
      default: ''
    }
  },
  watch: {},
  data() {
    return {
      expand: this.expanded
    };
  },
  methods: {
    onHoverSplitter() {
      this.$el.querySelector('.sprite-pointer-down').classList.add('sprite-pointer-down-hover');
    },
    onLeaveSplitter() {
      this.$el.querySelector('.sprite-pointer-down').classList.remove('sprite-pointer-down-hover');
    }
  }
};
</script>
