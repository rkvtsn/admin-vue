<template>
  <div class="valid-input">
    <slot name="before-label"></slot>
    <slot name="label">
      <label v-if="label" :class="{required: isRequired}" :for="labelId" class="control-label">{{label}}:</label>
    </slot>
    
    <textarea v-if="type === 'textarea' || type === 'textarea-fixed'"
              ref="input"
              :name="labelId" 
              :maxlength="maxlength"
              :style="{ width: width, 'min-height': minHeight, resize: (type === 'textarea-fixed') ? 'none' : '' }" 
              class="form-control"
              :id="labelId" 
              autocomplete="off"
              :class="{'error': validation && validation.error}"
              @input="onInput($event)"
              :value="value"
              :readonly="readonly"
              :placeholder="placeholder"></textarea>

    <input v-else-if="type === 'number' || type === 'price'"
           ref="input"
           class="form-control"
           :maxlength="maxlength"
           type="text"
           :name="labelId"
           :id="labelId"
           :style="{width: width}"
           autocomplete="off"
           @keydown.enter="onSubmitNumber($event)"
           @keypress="isNumber($event)"
           @input="onInput($event)"
           @blur.prevent="numberBlur($event)"
           :value="value"
           style="text-align-last: right; text-align: right"
           :readonly="readonly"
           :placeholder="placeholder" />

    <input v-else
           ref="input"
           :type="type" :name="labelId"
           :maxlength="maxlength"
           :style="{ width: width }"
           class="form-control"
           :id="labelId"
           autocomplete="off"
           :class="{'error': validation && validation.error}"
           @input="onInput($event)"
           :value="value"
           :readonly="readonly"
           :placeholder="placeholder" />
    
    <slot></slot>
    
    <span v-if="validation && validation.error" class="label label-danger">{{ error }}</span>
    <span v-if="validation" class="label label-danger">
      <span v-for="(e, index) in validation.errors" :key="index">{{e}}</span>
    </span>
  </div>
</template>

<style lang="less">

// .required {
//   padding-right: 7px;
//   margin-right: 7px;
//   position: relative;
// }
// .required:after {
//   position: absolute;
//   top: -4px;
//   right: 0px;
//   color: red;
//   content: "*";
// }

</style>

<script>
const MAX_NUMBER = 9999999999999;

export default {
  props: {
    parse: {
      type: Function,
      default: parseFloat
    },
    placeholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    width: {
      type: String,
      default: ''
    },
    minHeight: {
      type: String,
      default: '80px !important'
    },
    error: {
      type: String,
      default: 'Некорректный ввод'
    },
    label: {
      type: [Number, String],
      default: ''
    },
    for: {
      type: [Number, String],
      default: () => {
        let seed = (Date.now) ? Date.now() : Date().getTime();
        return Math.floor((1 + Math.random()) * 0x10000 * Math.round(seed / 1000))
          .toString(16)
          .substring(1);
        } // make unique ID for each input on page
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
      type: [Number],
      default: null
    },
    min: {
      type: [Number],
      default: null
    }
  },
  methods: {
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode > 36 && (charCode < 48 || charCode > 58) && charCode !== 46 && charCode !== 45 && charCode !== 190 && charCode !== 189) {
        if (evt.which !== 0) evt.preventDefault();
      }
      return true;
    },
    checkNumber(e) {
      // let number = this.parse(e.target.value);
      
      // if (isNaN(number)) {
      //   e.target.value = '';
      // } else {
      //   if (number > MAX_NUMBER || number < Number.MIN_SAFE_INTEGER) {
      //     number = e.target.value;
      //   }
      //   number = (number > MAX_NUMBER) ? MAX_NUMBER : number;
      //   number = (number < Number.MIN_SAFE_INTEGER) ? Number.MIN_SAFE_INTEGER : number;
      //   e.target.value = number;
      // }

      // if (this.max !== null) {
      //   e.target.value = (Number(e.target.value) > this.max) ? this.max : e.target.value;
      // }
      // if (this.min !== null && e.target.value !== null && e.target.value !== '') {
      //   e.target.value = (Number(e.target.value) < this.min) ? this.min : e.target.value;
      // }
      e.target.value = this.makeNumber(e.target.value);
      if (this.validation) {
        this.validation.$touch();
      }
      // this.value = e.target.value;
    },
    makeNumber(v) {
      let number = this.parse(v);
      
      if (isNaN(number)) {
        v = '';
      } else {
        if (number > MAX_NUMBER || number < Number.MIN_SAFE_INTEGER) {
          number = v;
        }
        number = (number > MAX_NUMBER) ? MAX_NUMBER : number;
        number = (number < Number.MIN_SAFE_INTEGER) ? Number.MIN_SAFE_INTEGER : number;
        v = number;
      }

      if (this.max !== null) {
        v = (Number(v) > this.max) ? this.max : v;
      }
      if (this.min !== null && v !== null && v !== '') {
        v = (Number(v) < this.min) ? this.min : v;
      }

      return v;
    },
    onSubmitNumber(e) {
      this.checkNumber(e);
      this.$emit('input', e.target.value);
    },
    numberBlur(e) {
      this.checkNumber(e);
      this.$emit('blur', e.target.value);
      this.$emit('input', e.target.value);
    },
    onInput(e) {
      this.$emit('input', e.target.value);
    }
  },
  watch: {
    value(v) {
      // var event = document.createEvent('Event');
      // event.initEvent('input', true, false);
      // this.$refs['input'].dispatchEvent(event);
      if (this.validation) {
        this.validation.$touch();
      }
    }
  },
  computed: {
    isRequired() {
      return (this.validation && Array.isArray(this.validation.meta) && this.validation.meta.indexOf('required') > -1);
    },
    labelId() {
      return `input_${this.for}`;
    }
  }
};
</script>
