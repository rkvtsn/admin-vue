<style lang="scss">
@import "../../../../../css/theme/white/colors.scss";

$option-height: 30px;
$option-hover-bg: #ddf2fd;
$option-border: 1px solid $option-hover-bg;
$option-select-bg: $faded-blue-two;

fieldset[disabled] .multiselect {
  pointer-events: none;
}

.multiselect {
  input[type="text"],
  input[type="text"]:hover,
  input[type="text"]:focus {
    border: none !important;
    outline: none !important;
    max-height: 28px;
    min-height: 28px;
    box-shadow: none !important;
  }
}

.multiselect__spinner {
  position: absolute;
  right: 1px;
  top: 1px;
  width: 48px;
  height: 35px;
  background: #fff;
  display: block;
}

.multiselect__spinner:before,
.multiselect__spinner:after {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  width: 16px;
  height: 16px;
  border-radius: 100%;
  border-color: #fff transparent transparent;
  border-style: solid;
  border-width: 2px;
  box-shadow: 0 0 0 1px transparent;
  color: $black;
}

.multiselect__spinner:before {
  animation: spinning 2.4s cubic-bezier(0.41, 0.26, 0.2, 0.62);
  animation-iteration-count: infinite;
}

.multiselect__spinner:after {
  animation: spinning 2.4s cubic-bezier(0.51, 0.09, 0.21, 0.8);
  animation-iteration-count: infinite;
}

.multiselect__loading-enter-active,
.multiselect__loading-leave-active {
  transition: opacity 0.4s ease-in-out;
  opacity: 1;
}

.multiselect__loading-enter,
.multiselect__loading-leave-active {
  opacity: 0;
}

.multiselect,
.multiselect__input,
.multiselect__single {
  font-family: inherit;
  font-size: 13px;
  touch-action: manipulation;
}

.multiselect__single {
  overflow: hidden;
  max-height: 24px;
}

.multiselect {
  box-sizing: content-box;
  display: block;
  position: relative;
  width: 100%;
  min-height: $option-height;
  text-align: left;
  color: #35495e;
}

.multiselect * {
  box-sizing: border-box;
}

.multiselect:focus {
  outline: none;
}

.multiselect--disabled {
  background: #ededed;
  pointer-events: none;
  opacity: 0.6;
}

.multiselect--active {
  z-index: 50;
}

.multiselect--active .multiselect__select {
  transform: rotateZ(180deg);
}

.multiselect__input,
.multiselect__single {
  position: relative;
  display: inline-block;
  min-height: 20px;
  line-height: 20px;
  border: none;
  background: #fff;
  padding: 0;
  width: calc(100%);
  transition: border 0.1s ease;
  box-sizing: border-box;
  margin-bottom: 8px;
  vertical-align: top;
}

.multiselect__input::placeholder {
  color: #35495e;
}

.multiselect__tag ~ .multiselect__input,
.multiselect__tag ~ .multiselect__single {
  width: auto;
}

.multiselect__input:hover,
.multiselect__single:hover {
  border-color: #cfcfcf;
}

.multiselect__input:focus,
.multiselect__single:focus {
  border-color: #a8a8a8;
  outline: none;
}

.multiselect__single {
  margin-bottom: 0px;
  padding-top: 4px;
}

.multiselect__tags-wrap {
  display: inline;
}

.multiselect__tags {
  min-height: $option-height;
  display: block;
  padding: 0px 26px 0px 5px;
  border: 1px solid $field-border;
  background: #fff;
  font-size: 13px;
}

.multiselect__tags--fixed {
  max-height: 30px;
  overflow: hidden;
}

.multiselect__tag {
  position: relative;
  display: inline-flex;
  color: $black;
  line-height: 1;
  background: #fff;
  margin-bottom: 0px;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  margin-bottom: 0px;
  margin-top: 4px;
  padding: 3px;
  padding-left: 0;
  // margin-left: 5px;
  padding-right: 2px;
}

.multiselect__tag:after {
  content: ";";
}

.multiselect__tag-icon {
  cursor: pointer;
  position: absolute;
  top: 0;
  font-style: initial;
  text-align: center;
  line-height: 20px;
  transition: all 0.2s ease;
}

.multiselect__tag-icon:after {
  content: ";";
  // color: #266d4d;
  font-size: 13px;
}

.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  // background: #369a6e;
}

.multiselect__tag-icon:focus:after,
.multiselect__tag-icon:hover:after {
  // color: white;
  content: "x";
  padding-left: 1px;
}

.multiselect__current {
  line-height: 16px;
  min-height: $option-height;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  padding: 8px 12px 0;
  padding-right: 30px;
  white-space: nowrap;
  margin: 0;
  text-decoration: none;
  border: 1px solid #e8e8e8;
  cursor: pointer;
}

.multiselect__select {
  line-height: 16px;
  display: block;
  position: absolute;
  box-sizing: border-box;
  width: 26px;
  height: 26px;
  right: 1px;
  top: 1px;
  padding: 4px 0;
  margin: 0;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

@-moz-document url-prefix() {
  .multiselect__select {
    top: -2px;
  }
  .multiselect--active .multiselect__select {
    top: -1px;
  }
}

.multiselect__select:before {
  position: relative;
  right: 0;
  top: 65%;
  color: $black;
  margin-top: 4px;
  border-style: solid;
  border-width: 4px 4px 0 4px;
  border-color: $black transparent transparent transparent;
  content: "";
}

.multiselect__placeholder {
  color: #adadad;
  display: inline-block;
  margin-bottom: 10px;
  padding-top: 6px;
}

.multiselect--active .multiselect__placeholder {
  display: none;
}

.multiselect__content-wrapper {
  position: absolute;
  display: block;
  background: #fff;
  width: 100%;
  max-height: 210px;
  // overflow-y: scroll;
  // border: 1px solid $field-border;
  // border-top: none;
  z-index: 50;
  -webkit-overflow-scrolling: touch;
}

.multiselect__content {
  background: #fff;
  overflow-y: scroll;
  max-height: 210px;
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}

.multiselect--above .multiselect__content-wrapper {
  bottom: 100%;
  border-bottom: none;
  border-top: 1px solid #e8e8e8;
}

.multiselect__content::webkit-scrollbar {
  display: none;
}

.multiselect__element {
  display: block;
}

.multiselect__option {
  border: $option-border;
  border-top: none;
  display: block;
  min-height: $option-height;
  padding: 0 8px;
  line-height: 30px;
  font-size: 13px;
  text-decoration: none;
  text-transform: none;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
  &__checkbox {
    display: inline-block;
    padding: 0;
    margin-left: 10px !important;
    vertical-align: middle;

    &--checked {
      display: none;
    }
    &--unchecked {
      display: inline-block;
    }
  }
}

.multiselect__option:after {
  top: 0;
  right: 0;
  position: absolute;
  line-height: $option-height;
  padding-right: 12px;
  padding-left: 20px;
  font-size: 13px;
}

.multiselect__option--highlight {
  background: $option-hover-bg;
  outline: none;
}

.multiselect__option--highlight:after {
  content: attr(data-select);
  background: $option-hover-bg;
}

.multiselect__option--selected {
  background: $option-select-bg;
  color: #fff;
  // font-weight: bold;
  .multiselect__option__checkbox--checked {
    display: inline-block;
  }
  .multiselect__option__checkbox--unchecked {
    display: none;
  }
}

.multiselect__option--selected:after {
  content: attr(data-selected);
  color: silver;
}

.multiselect__option--selected.multiselect__option--highlight {
  background: $option-hover-bg;
  color: $black;
}

.multiselect__option--selected.multiselect__option--highlight:after {
  background: $option-hover-bg;
  content: attr(data-deselect);
  color: $black;
}

.multiselect--disabled .multiselect__current,
.multiselect--disabled .multiselect__select {
  color: #fff;
}

.multiselect__option--disabled {
  background: #ededed !important;
  color: #a6a6a6 !important;
  cursor: text;
  pointer-events: none;
}

.multiselect__option--group {
  background: #ededed;
  color: #35495e;
}

.multiselect__option--group.multiselect__option--highlight {
  background: #35495e;
  color: #fff;
}

.multiselect__option--group.multiselect__option--highlight:after {
  background: #35495e;
}

.multiselect__option--disabled.multiselect__option--highlight {
  background: #dedede;
}

.multiselect__option--group-selected.multiselect__option--highlight {
  background: #ff6a6a;
  color: #fff;
}

.multiselect__option--group-selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  content: attr(data-deselect);
  color: #fff;
}

.multiselect-enter-active,
.multiselect-leave-active {
  transition: all 0.15s ease;
}

.multiselect-enter,
.multiselect-leave-active {
  opacity: 0;
}

.multiselect__clear {
  position: absolute;
  right: 23px;
  top: 3px;
  height: 100%;
  display: block;
  cursor: pointer;
  font-size: 23px;
  line-height: 25px;
  color: #9e9e9e;
  z-index: 2;
}

.multiselect__strong {
  line-height: 16px;
  display: inline-block;
  vertical-align: top;
  font-size: 13px;
  padding: 0 5px;
  margin-bottom: 8px;
  margin-top: 5px;
  margin-left: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 3px;
}

*[dir="rtl"] .multiselect {
  text-align: right;
}

*[dir="rtl"] .multiselect__select {
  right: auto;
  left: 1px;
}

*[dir="rtl"] .multiselect__tags {
  padding: 0px 0px 0px 26px;
}

*[dir="rtl"] .multiselect__content {
  text-align: right;
}

*[dir="rtl"] .multiselect__option:after {
  right: auto;
  left: 0;
}

*[dir="rtl"] .multiselect__clear {
  right: auto;
  left: 12px;
}

*[dir="rtl"] .multiselect__spinner {
  right: auto;
  left: 1px;
}

@keyframes spinning {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(2turn);
  }
}
</style>

<template>
  <div :tabindex="searchable ? -1 : tabindex"
       :class="{ 'multiselect--active': isOpen, 'multiselect--disabled': disabled, 'multiselect--above': isAbove }"
       @focus="activate()"
       @blur="searchable ? false : deactivate()"
       @keydown.self.down.prevent="pointerForward()"
       @keydown.self.up.prevent="pointerBackward()"
       @keypress.enter.tab.stop.self="addPointerElement($event)"
       @keyup.esc="deactivate()"
       class="multiselect"
       role="combobox"
       :aria-owns="'listbox-'+id">
    <slot name="caret"
          :toggle="toggle">
      <div @mousedown.prevent.stop="toggle()"
           class="multiselect__select"></div>
    </slot>
    <slot v-if="clearable"
          name="clear"
          :search="search">
      <div v-if="(multiple && value.length) || (!multiple && value)"
           title="Очистить"
           class="multiselect__clear"
           @mousedown.prevent.stop="onClear">×</div>
    </slot>
    <div ref="tags"
         class="multiselect__tags"
         :class="{'multiselect__tags--fixed': fixedTags}">
      <slot name="selection"
            :search="search"
            :remove="removeElement"
            :values="visibleValues"
            :is-open="isOpen">
        <div class="multiselect__tags-wrap"
             v-show="visibleValues.length > 0">
          <template v-for="(option, index) of visibleValues"
                    @mousedown.prevent>
            <slot name="tag"
                  :option="option"
                  :search="search"
                  :remove="removeElement">
              <span class="multiselect__tag"
                    :key="index">
                <span v-text="getOptionLabel(option)"></span>
                <i v-if="tagCloseable"
                   aria-hidden="true"
                   tabindex="1"
                   @keypress.enter.prevent="removeElement(option)"
                   @mousedown.prevent="removeElement(option)"
                   class="multiselect__tag-icon"></i>
              </span>
            </slot>
          </template>
        </div>
        <template v-if="internalValue && internalValue.length > limit">
          <slot name="limit">
            <span class="multiselect__strong"
                  v-text="limitText(internalValue.length - limit)" />
          </slot>
        </template>
      </slot>
      <transition name="multiselect__loading">
        <slot name="loading">
          <div v-show="loading"
               class="multiselect__spinner" />
        </slot>
      </transition>
      <input ref="search"
             v-if="searchable"
             :name="name"
             :id="id"
             type="text"
             autocomplete="nope"
             spellcheck="false"
             :placeholder="placeholder"
             :style="inputStyle"
             :value="search"
             :disabled="disabled"
             :tabindex="tabindex"
             @input="updateSearch($event.target.value)"
             @focus.prevent="activate()"
             @blur.prevent="deactivate()"
             @keyup.esc="deactivate()"
             @keydown.down.prevent="pointerForward()"
             @keydown.up.prevent="pointerBackward()"
             @keypress.enter.prevent.stop.self="addPointerElement($event)"
             @keydown.delete.stop="removeLastElement()"
             class="multiselect__input"
             :aria-controls="'listbox-'+id" />
      <span v-if="isSingleLabelVisible"
            class="multiselect__single"
            @mousedown.prevent="toggle">
        <slot name="singleLabel"
              :option="singleValue">
          <template>{{ currentOptionLabel }}</template>
        </slot>
      </span>
      <span v-if="isPlaceholderVisible"
            class="multiselect__placeholder"
            @mousedown.prevent="toggle">
        <slot name="placeholder">
          {{ placeholder }}
        </slot>
      </span>
    </div>
    <transition name="multiselect">
      <div class="multiselect__content-wrapper"
           v-show="isOpen"
           @focus="activate"
           tabindex="-1"
           @mousedown.prevent
           :style="{ maxHeight: optimizedHeight + 'px' }"
           ref="list">
        <ul class="multiselect__content"
            :style="contentStyle"
            role="listbox"
            :id="'listbox-'+id">
          <slot name="beforeList"></slot>
          <li v-if="multiple && max === internalValue.length">
            <span class="multiselect__option">
              <slot name="maxElements">Максимально допустимое количество {{ max }} вариантов выбрано.</slot>
            </span>
          </li>
          <template v-if="!max || internalValue.length < max">
            <li class="multiselect__element"
                v-for="(option, index) of filteredOptions"
                :key="index"
                v-bind:id="id + '-' + index"
                v-bind:role="!(option && (option.$isLabel || option.$isDisabled)) ? 'option' : null">
              <span v-if="!(option && (option.$isLabel || option.$isDisabled))"
                    :class="optionHighlight(index, option)"
                    @click.stop="select(option)"
                    @mouseenter.self="pointerSet(index)"
                    :data-select="option && option.isTag ? tagPlaceholder : selectLabelText"
                    :data-selected="selectedLabelText"
                    :data-deselect="deselectLabelText"
                    class="multiselect__option">
                <slot name="option"
                      :option="option"
                      :search="search">
                  <span>
                    {{ getOptionLabel(option) }}
                  </span>
                  <input v-if="withCheckbox"
                         class="multiselect__option__checkbox multiselect__option__checkbox--checked"
                         type="checkbox"
                         checked
                         readonly="readonly" />
                  <input v-if="withCheckbox"
                         class="multiselect__option__checkbox multiselect__option__checkbox--unchecked"
                         type="checkbox"
                         readonly="readonly" />
                </slot>
              </span>
              <span v-if="option && (option.$isLabel || option.$isDisabled)"
                    :data-select="groupSelect && selectGroupLabelText"
                    :data-deselect="groupSelect && deselectGroupLabelText"
                    :class="groupHighlight(index, option)"
                    @mouseenter.self="groupSelect && pointerSet(index)"
                    @mousedown.prevent="selectGroup(option)"
                    class="multiselect__option">
                <slot name="option"
                      :option="option"
                      :search="search">
                  <span>{{ getOptionLabel(option) }}</span>
                </slot>
              </span>
            </li>
          </template>
          <li v-show="showNoResults && (filteredOptions.length === 0 && search && !loading)">
            <span class="multiselect__option">
              <slot name="noResult"
                    :search="search">Не найдено.</slot>
            </span>
          </li>
          <li v-show="showNoOptions && (data.length === 0 && !search && !loading)">
            <span class="multiselect__option">
              <slot name="noOptions">Список пуст.</slot>
            </span>
          </li>
          <slot name="afterList"></slot>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import multiselectMixin from './multiselectMixin';
import pointerMixin from './pointerMixin';

export default {
  name: 'multiselect',
  mixins: [multiselectMixin, pointerMixin],
  props: {
    /**
     * Очистка выбранных
     */
    clearable: {
      type: Boolean,
      default: false
    },
    /**
     * Отображать чекбоксы
     * @default false
     * @type {Boolean}
     */
    withCheckbox: {
      type: Boolean,
      default: false
    },
    /**
     * Фиксированная высота поля выбора
     * @default true
     * @type {Boolean}
     */
    fixedTags: {
      type: Boolean,
      default: true
    },
    /**
     * Удаление выбранных тегов из поля
     * @default false
     * @type {Boolean}
     */
    tagCloseable: {
      type: Boolean,
      default: false
    },
    /**
     * Атрибут 'name' html тега
     * @default ''
     * @type {String}
     */
    name: {
      type: String,
      default: ''
    },
    /**
     * Текст элемента при выделении
     * @default ''
     * @type {String}
     */
    selectLabel: {
      type: String,
      default: ''
    },
    /**
     * Текст группового элемента при выделении
     * @default ''
     * @type {String}
     */
    selectGroupLabel: {
      type: String,
      default: ''
    },
    /**
     * Текст выделенный элемент
     * @default ''
     * @type {String}
     */
    selectedLabel: {
      type: String,
      default: ''
    },
    /**
     * Тест при отмене выбора
     * @default ''
     * @type {String}
     */
    deselectLabel: {
      type: String,
      default: ''
    },
    /**
     * Текст при отмене выбора группы
     * @default ''
     * @type {String}
     */
    deselectGroupLabel: {
      type: String,
      default: ''
    },
    /**
     * Флаг
     * @default true
     * @type {Boolean}
     */
    showLabels: {
      type: Boolean,
      default: true
    },
    /**
     * Ограничение по кол-ву эл-ов выбора
     * @default 99999
     * @type {Integer}
     */
    limit: {
      type: Number,
      default: 99999
    },
    /**
     * Максимальная высота
     * @default 300
     * @type {Integer}
     */
    maxHeight: {
      type: Number,
      default: 300
    },
    /**
     * Функция обрабатывает сообщение
     * отображаемое при выборе элементы проходят определенный предел.
     * @default '+*'
     * @param {Int} count Количество элементов больше лимита
     * @type {Function}
     */
    limitText: {
      type: Function,
      default: count => `+${count}`
    },
    /**
     * Set true to trigger the loading spinner.
     * @default False
     * @type {Boolean}
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Disables the multiselect if true.
     * @default false
     * @type {Boolean}
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Fixed opening direction
     * @default ''
     * @type {String}
     */
    openDirection: {
      type: String,
      default: ''
    },
    /**
     * Shows slot with message about empty options
     * @default true
     * @type {Boolean}
     */
    showNoOptions: {
      type: Boolean,
      default: true
    },
    showNoResults: {
      type: Boolean,
      default: true
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },

  computed: {
    isSingleLabelVisible() {
      return (
        (this.singleValue || this.singleValue === 0) &&
        (!this.isOpen || !this.searchable) &&
        !this.visibleValues.length
      );
    },
    isPlaceholderVisible() {
      return !this.internalValue.length && (!this.searchable || !this.isOpen);
    },
    visibleValues() {
      return this.multiple ? this.internalValue.slice(0, this.limit) : [];
    },
    singleValue() {
      return this.internalValue[0];
    },
    deselectLabelText() {
      return this.showLabels ? this.deselectLabel : '';
    },
    deselectGroupLabelText() {
      return this.showLabels ? this.deselectGroupLabel : '';
    },
    selectLabelText() {
      return this.showLabels ? this.selectLabel : '';
    },
    selectGroupLabelText() {
      return this.showLabels ? this.selectGroupLabel : '';
    },
    selectedLabelText() {
      return this.showLabels ? this.selectedLabel : '';
    },
    inputStyle() {
      if (
        this.searchable ||
        (this.multiple && this.value && this.value.length)
      ) {
        // Hide input by setting the width to 0 allowing it to receive focus
        return this.isOpen
          ? { width: '100%' }
          : { width: '0', position: 'absolute', padding: '0' };
      }
    },
    contentStyle() {
      return this.data.length
        ? { display: 'inline-block' }
        : { display: 'block' };
    },
    isAbove() {
      if (this.openDirection === 'above' || this.openDirection === 'top') {
        return true;
      } else if (
        this.openDirection === 'below' ||
        this.openDirection === 'bottom'
      ) {
        return false;
      } else {
        return this.preferredOpenDirection === 'above';
      }
    },
    showSearchInput() {
      return (
        this.searchable &&
        (this.hasSingleSelectedSlot &&
          (this.visibleSingleValue || this.visibleSingleValue === 0)
          ? this.isOpen
          : true)
      );
    }
  }
};
</script>

