<template>
  <div class="NicInput NicForm__Component"
       :class="inputClasses">
    <slot name="before-label"></slot>
    <slot name="label">
      <label :style="{width: labelWidth, 'min-width': labelWidth, 'max-width': labelWidth}"
             :for="labelId"
             v-if="label"
             class="NicLabel">{{textLabel}}</label>
    </slot>

    <div class="NicInput__Body"
         :style="{'max-width': width}">
      <div class="NicInput__Item">

        <textarea v-if="type === 'textarea' || type === 'textarea-fixed'"
                  v-tooltip="{ content: errors, html: true, trigger: 'manual', show: isErrorMsg, classes: ['tooltip__nic-input', 'tooltip--error'] }"
                  autocomplete="off"
                  ref="input"
                  :class="`NicInput__Item__Field NicInput-${type}`"
                  :disabled="isDisabled"
                  :name="labelId"
                  :id="labelId"
                  :maxlength="maxlength"
                  :placeholder="placeholder"
                  :readonly="isReadonly"
                  :style="{ 'min-height': minHeight, resize: (type === 'textarea-fixed') ? 'none' : '' }"
                  :value="value"
                  @input="onInput"
                  @focus="(e) => {this.$emit('focus', e)}"
                  @mouseover="(e) => {isErrorMsg = true; this.$emit('mouseover', e)}"
                  @mouseleave="(e) => {isErrorMsg = false; this.$emit('mouseleave', e)}"
                  @blur="(e) => {isErrorMsg = false; this.$emit('blur', e)}"></textarea>

        <input v-else-if="type === 'currency'"
               v-tooltip="{ content: errors, html: true, trigger: 'manual', show: isErrorMsg, classes: ['tooltip__nic-input', 'tooltip--error'] }"
               autocomplete="off"
               style="text-align-last: right; text-align: right"
               type="text"
               ref="input"
               :class="`NicInput__Item__Field NicInput-${type}`"
               :disabled="isDisabled"
               :name="labelId"
               :id="labelId"
               :maxlength="maxlength"
               :placeholder="placeholder"
               :readonly="isReadonly"
               :value="v"
               @input="onInput2"
               @focus="onFocus"
               @keypress="isNumber"
               @blur="onBlur" />

        <input v-else-if="type === 'number'"
               v-tooltip="{ content: errors, html: true, trigger: 'manual', show: isErrorMsg, classes: ['tooltip__nic-input', 'tooltip--error'] }"
               autocomplete="off"
               style="text-align-last: right; text-align: right"
               type="text"
               ref="input"
               :class="`NicInput__Item__Field NicInput-${type}`"
               :disabled="isDisabled"
               :name="labelId"
               :id="labelId"
               :maxlength="maxlength"
               :placeholder="placeholder"
               :readonly="isReadonly"
               :value="value"
               @input="onInput"
               @blur="onBlurNumber"
               @mouseover="isErrorMsg = true"
               @mouseleave="isErrorMsg = false"
               @keydown.enter="onSubmitNumber"
               @keypress="isNumber"
               @keyup="replaceColonsWithDots" />

        <input v-else
               v-tooltip="{ content: errors, html: true, trigger: 'manual', show: isErrorMsg, classes: ['tooltip__nic-input', 'tooltip--error'] }"
               autocomplete="off"
               ref="input"
               :class="`NicInput__Item__Field NicInput-${type}`"
               :disabled="isDisabled"
               :id="labelId"
               :maxlength="maxlength"
               :name="labelId"
               :placeholder="placeholder"
               :readonly="isReadonly"
               :type="type"
               :value="value"
               @input="onInput"
               @mouseover="isErrorMsg = true"
               @blur="isErrorMsg = false"
               @mouseleave="isErrorMsg = false" />

        <nic-error-label :has-error="hasErrors"></nic-error-label>
      </div>

      <div v-if="!!$slots.default"
           class="NicInput__Slot">
        <slot></slot>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
.NicInput {
  &__Slot {
    margin-left: 3px;
  }
  &.newline {
    display: block;

    .NicLabel,
    .NicInput__Item {
      display: block;
      margin-left: 0;
    }
  }

  .NicInput__Item {
    width: 100%;
    max-width: 800px;
    position: relative;
    padding-right: 10px;

    .NicInput__Item__Field {
      width: 100%;
    }
  }
}
.NicInput__Body {
  display: flex;
  width: 100%;
  align-items: center;
  vertical-align: middle;
}
</style>

<script>
import NicLabelMixin from './mixins/NicLabelMixin.vue';
import NicFormComponentMixin from './mixins/NicFormComponentMixin.vue';

const MAX_NUMBER = 9999999999999;

export default {

  mixins: [NicLabelMixin, NicFormComponentMixin],

  name: 'nic-input',

  props: {
    parse: {
      type: Function,
      default: parseFloat
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    fixedBy: {
      type: Number,
      default: 5
    },
    minHeight: {
      type: String,
      default: '80px !important'
    },
    maxlength: {
      type: Number,
      default: () => null
    },
    validation: {
      type: Object,
      default: () => null
    },
    value: {
      type: [Number, String],
      default: ''
    },
    max: {
      type: Number,
      default: null
    },
    min: {
      type: Number,
      default: null
    },
    errorMessage: {
      type: String,
      default: () => null
    },
    default: {
      type: [String, Number],
      default: () => null
    }
  },

  // TODO: сделать общий форматер для разных типов данных
  data() {
    let v = (this.type === 'currency') ? this.formatCurrency(this.value) : this.value;
    return {
      isErrorMsg: false,
      isError: false,
      metaClasses: {},
      v,
      isFocus: false
    };
  },


  watch: {
    value(v) {
      this.touchValidation();
      if (!this.isFocus && this.type === 'currency') {
        this.v = this.formatCurrency(v);
      }
    }
  },


  created() {
    if (this.validation && Array.isArray(this.validation.meta)) {
      this.metaClasses = {};
      for (let key of this.validation.meta) {
        this.metaClasses[key] = true;
      }
    }
  },


  computed: {

    errors() {
      if (!this.hasErrors) return null;
      let e = '';
      if (this.errorMessage) {
        e += this.errorMessage + '<br/>';
      }
      if (this.validation && this.validation.errors.length) {
        e += this.validation.errors.join('<br/>');
      }
      return e;
    },

    hasErrors() {
      return this.errorMessage || this.validation && this.validation.errors.length > 0;
    },

    inputClasses() {
      return Object.assign(
        {
          'NicForm__Component-HasError': this.hasErrors,
          'NicInput-textarea':
            this.type === 'textarea' || this.type === 'textarea-fixed'
        },
        this.metaClasses,
        this.classes
      );
    }

  },


  methods: {

    formatCurrency(v) {
      if (!v) return '';
      let value = parseFloat(v.toString().replace(/,/g, '.').replace(/ /g, '')).toFixed(5);
      if (isNaN(value)) {
        return '';
      }
      let [a, b] = value.split('.');
      return a.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + '.' + b;
    },

    deformatCurrency(v) {
      let value = parseFloat(v.toString().replace(/,/g, '.').replace(/ /g, ''));
      if (value === 0) return 0;
      return value || '';
    },

    onBlur(event) {
      this.isErrorMsg = false;
      this.isFocus = false;
      this.v = '';
      this.v = this.formatCurrency(event.target.value);
      this.$emit('blur', event);
      let value = this.deformatCurrency(this.v);
      if (this.value !== value) {
        this.$emit('input', value);
      }
    },

    onBlurNumber(event) {
      if (this.default !== null && event.target.value == '') {
        this.$emit('input', this.parse(this.default) || this.default);
        this.$emit('blur', this.default);
      } else {
        let v = this.parse(event.target.value);
        this.$emit('input', !isNaN(v) ? v : event.target.value);
        this.$emit('blur', event.target.value);
      }
    },

    replaceColonsWithDots(event) {
      event.target.value = event.target.value.replace(/,/g, '.');
    },

    isNumber(event) {
      // Разрешить ввод только следующих символов: <символ> (<код символа>);
      // , (44); - (45); . (46); [0-9] (48-57)
      // В Mozilla Firefox: Backspace (8) и Delete (46)
      // event = (event) ? event : window.event;
      let charCode = event.which ? event.which : event.keyCode;
      if (
        charCode !== 8 &&
        (charCode < 44 || charCode > 57 || charCode === 47)
      ) {
        if (event.which !== 0) {
          event.preventDefault();
        }
      }
      return true;
    },

    checkNumber(e) {
      e.target.value = this.makeNumber(e.target.value);
    },

    makeNumber(v) {
      v = v.replace(/,/g, '.');
      if ((v === '-' || v === '-0') || v.replace(/ /g, '').match(/^-?\d*\.\d*0+$/) || v.replace(/ /g, '').match(/^-?\d*\.$/)) {
        return v;
      }

      let number = this.parse(v);

      if (isNaN(number)) {
        v = "";
      } else {
        if (number > MAX_NUMBER || number < Number.MIN_SAFE_INTEGER) {
          number = v;
        }
        number = number > MAX_NUMBER ? MAX_NUMBER : number;
        number =
          number < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : number;
        v = number;
      }

      if (this.max !== null) {
        v = Number(v) > this.max ? this.max : v;
      }
      if (this.min !== null && v !== null && v !== "") {
        v = Number(v) < this.min ? this.min : v;
      }

      return v;
    },

    onSubmitNumber(e) {
      this.replaceColonsWithDots(e);
      this.checkNumber(e);
      this.$emit('input', e.target.value);
    },

    onInput(e) {
      if (this.type === 'number') this.checkNumber(e);
      this.$emit('input', e.target.value);
      this.touchValidation();
    },

    onFocus(e) {
      // this.v = this.deformatCurrency(this.v);
      this.isErrorMsg = true;
      this.isFocus = true;
    },

    // TODO: не есть хорошо
    onInput2(e) {
      if (this.type === 'number') this.checkNumber(e);
      this.v = e.target.value; //this.formatCurrency(e.target.value);
      let value = this.deformatCurrency(this.v);
      if (value !== this.value) {
        this.$emit('input', value);
        this.touchValidation();
      }
    },

    touchValidation() {
      this.isError = false;
      if (this.validation) {
        this.validation.$touch();
        this.$nextTick(() => {
          this.isError = this.validation.errors.length > 0;
        });
      }
    },

  },


};
</script>
