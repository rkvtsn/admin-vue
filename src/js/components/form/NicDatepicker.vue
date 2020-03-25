
<style lang="scss">
.NicDatetimePicker {
  // display: flex;
  // > .NicDatetimePicker__Body {
  //   position: relative;
  //   flex: 0;
  // }
  .NicDatetimePicker__Item,
  .NicInput__Item__Field {
    width: 100%;
  }
  .picker-wrap table.date-picker {
    border-radius: 3px;
  }

  .mx-input-append {
    width: 20px;
    position: absolute;
    padding: 0;
    right: 4px;
    top: -1px;
  }

  .mx-panel.mx-panel-time {
    display: flex;
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

  .NicInput__Body {
    display: flex;
    width: 100%;
    align-items: center;
    vertical-align: middle;
  }

  // @-moz-document url-prefix() {
  // }
}
</style>



<template>
  <div class="NicDatetimePicker NicForm__Component"
       :class="inputClasses">
    <slot name="label">
      <label :style="{width: labelWidth, 'min-width': labelWidth, 'max-width': labelWidth}"
             :for="labelId"
             class="NicLabel"
             v-if="label">{{textLabel}}</label>
    </slot>
    <div class="NicDatetimePicker__Body NicInput__Body"
         :style="{width: width, 'min-width': width, 'max-width': width}">
      <div class="NicDatetimePicker__Item NicInput__Item"
           @mouseover="isErrorMsg = true"
           @mouseleave="isErrorMsg = false">
        <date-picker :disabled="isDisabled"
                     v-tooltip="{ content: errors, html: true, trigger: 'manual', show: isErrorMsg, classes: ['tooltip__nic-input', 'tooltip--error'] }"
                     :lang="lang"
                     :value="value"
                     :placeholder="placeholder"
                     v-bind="options"
                     @input="x => $emit('input', x)"
                     @change="x => $emit('change', x)"
                     class="NicInput__Item__Field"></date-picker>

        <nic-error-label :has-error="hasErrors"></nic-error-label>

      </div>

    </div>
  </div>
</template>


<script>
import NicLabelMixin from './mixins/NicLabelMixin.vue';
import NicFormComponentMixin from './mixins/NicFormComponentMixin.vue';
import NicValidateable from './mixins/NicValidateable.vue';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';


export default {
  name: 'nic-datepicker',
  mixins: [NicLabelMixin, NicFormComponentMixin, NicValidateable],
  components: { DatePicker },
  props: {
    errorMessage: String,
    type: String,
    valueType: String,
    confirm: Boolean,
    timePickerOptions: {
      type: Object,
      default: () => null
    },
    minuteStep: Number,
    value: {
      type: [Date, String, Number],
      default: null
    },
    editable: {
      type: [Boolean],
      default: true
    },
    width: {
      type: String,
      default: '168px'
    },
    css: {
      type: Object,
      default: () => { }
    },
    format: {
      type: String,
      default: 'DD.MM.YYYY'
    }
  },
  data: function() {
    return {
      isErrorMsg: false,
      lang: {
        formatLocale: {
          months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
          weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
          weekdaysShort: ['Воск', 'Пон', 'Вт', 'Ср', 'Чт', 'Пят', 'Суб'],
          weekdaysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          monthBeforeYear: false,
          firstDayOfWeek: 1,
        },
      },
      /**
       * Value from #value (from props (component attribute).
       * @property {Date} [v]
       */
      v: this.value
    };
  },
  watch: {
    value(v) {
      this.v = v;
    },
    v(v) {
      this.$emit('input', v);
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

    options() {
      return {
        editable: this.editable,
        type: this.type,
        valueType: this.valueType,
        confirm: this.confirm,
        timePickerOptions: this.timePickerOptions,
        format: this.format,
        minuteStep: this.minuteStep,
        inputAttr: {
          id: this.labelId,
          name: this.labelId,
          readonly: this.isReadonly
        }
      };
    }
  }
};

</script>
