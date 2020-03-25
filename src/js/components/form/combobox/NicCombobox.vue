<template>
  <div class="NicInput nic-combobox NicForm__Component"
       :class="classNames">
    <slot name="before-label"></slot>
    <slot name="label">
      <template v-if="label">
        <template v-if="!labelAsHTML">
          <label :for="labelId"
                 :class="{ellipsis: label.length > 27}"
                 class="NicLabel">
            <span v-if="label.length > 27"
                  v-tooltip="label">{{textLabel}}</span>
            <span v-else>{{textLabel}}</span>
          </label>
        </template>
        <label v-else
               :for="labelId"
               class="NicLabel"
               v-html="textLabel">
        </label>
      </template>
    </slot>
    <div class="NicInput__Body"
         :style="{'max-width': width}">
      <div class="NicInput__Item"
           v-tooltip="tooltip"
           :style="{ width: width}">
        <multiselect class="NicInput__Item__Field NicInput-combobox"
                     :value="value"
                     :id="labelId"
                     :name="labelId"
                     @input="v => $emit('input', v)"
                     v-bind="$props">
          <template slot="option"
                    slot-scope="optionProps">
            <slot name="option"
                  v-bind="optionProps"></slot>
          </template>
          <template slot="noResult"
                    slot-scope="props">
            <slot name="noResult"
                  v-bind="props"></slot>
          </template>
          <template slot="afterList">
            <slot name="afterList"></slot>
          </template>
        </multiselect>
      </div>
    </div>
  </div>
</template>


<script>
import Multiselect from './src/Multiselect.vue';
import NicLabelMixin from '../mixins/NicLabelMixin.vue';
import NicFormComponentMixin from '../mixins/NicFormComponentMixin.vue';

/**
 * Компонент множественного выбора с выпадающим списком
 * @example
 * <nic-combobox :data="[{name: 'a', id: 'b'}]" v-model="value"></nic-combobox>
 * @param {Array|Object} [value=null] - выбранный элемент/ы
 * @param {Boolean} [withCheckbox=false] - [WIP] флаг с чекбоксами
 * @param {Boolean} [searchable=false] - поиск по списку
 * @param {Boolean} [clearable=false] - очистка выбранных
 * @param {Number} [limit] - ограничение по кол-ву выводимых выбранных эле-ов
 * @param {Number} [trackBy='id'] - по какому полю ведется выбор значений из 'data'
 * @param {Number} [closeOnSelect] - закрытие списка при выборе
 * @param {Number} [placeholder] - плейсхолдер
 * @param {Boolean} [multiple=false] - мультивыбор
 * @param {Array} data - список эл-ов для выбора
 * @param {String} [optionTitle='name'] - имя свойства эл-та для отрисовки текста
 * @param {Function} [customLabel] - ф-ция отрисовки текста
 * @param {String} [tooltip] - тултип
 * @param {Boolean} [clearOnSelect=false] - убираем если кликнул еще раз
 * @param {Boolean} [allowEmpty=false] - можно диселект делать
 * @param {Boolean} [preselectFirst=true] - выделить первый элемент
 */
export default {
  name: 'nic-combobox',
  components: { Multiselect },
  mixins: [NicLabelMixin, NicFormComponentMixin],
  props: {
    preselectFirst: {
      type: Boolean,
      default: true
    },
    allowEmpty: {
      type: Boolean,
      default: false
    },
    clearOnSelect: {
      type: Boolean,
      default: false
    },
    withCheckbox: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    value: {
      default: () => null,
    },
    limit: Number,
    trackBy: {
      type: String,
      default: 'id'
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    placeholder: String,
    multiple: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    optionTitle: {
      type: String,
      default: 'name'
    },
    customLabel: {
      type: Function,
      default(option, label) {
        if (isEmpty(option)) return '';
        return label ? option[label] : option;
      },
    },
    tooltip: null
  },

  computed: {
    classNames() {
      return { ...this.classes };
    }
  }

};
</script>
