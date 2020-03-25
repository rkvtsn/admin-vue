<template>

  <div :class="classes"
       class="NicSelect NicForm__Component">
    <slot name="label">
      <label :style="{width: labelWidth, 'min-width': labelWidth, 'max-width': labelWidth}"
             :for="labelId"
             class="NicLabel"
             v-if="label">{{textLabel}}</label>
    </slot>
    <div class="NicSelect__Item"
         :style="{width: width, 'min-width': width, 'max-width': width}">
      <select :disabled="isLoading || disabled"
              :height="height"
              :id="labelId"
              :name="labelId"
              :value="value"
              @change="onInput"
              class="NicSelect__Control">
        <template v-if="!noNull">
          <option :value="null"
                  class="NicSelect__ControlItem NicSelect__ControlItem-default"
                  v-if="!isLoading">&nbsp;<slot></slot>
          </option>

        </template>

        <option :value="null"
                class="NicSelect__ControlItem NicSelect__ControlItem-isLoading"
                v-if="isLoading">
          <slot name="option-is-loading">Загрузка...</slot>
        </option>
        <option :key="key"
                :value="fn(item, optionValue)"
                class="NicSelect__ControlItem"
                v-for="(item, key) in data">
          {{fn(item, optionText)}}
        </option>
      </select>

      <nic-loader :is-loading="isLoading"></nic-loader>
    </div>

  </div>

</template>


<style lang="scss" scoped>
.NicForm__Component-disabled {
  select:disabled {
    cursor: not-allowed;
    opacity: 0.9;
  }

  .NicLoader {
    cursor: not-allowed;
  }
}

.NicSelect {
  select {
    max-width: 800px;
    width: 100%;
  }
  &__Item {
    position: relative;
    &__Control {
      width: 100%;
      height: inherit;
    }

    .NicLoader {
      vertical-align: middle;
      display: inline-block;
      margin-left: -18px;
      position: absolute;
      bottom: 7px;
    }
  }
}

@-moz-document url-prefix() {
  .NicSelect .NicSelect__Control + .NicLoader {
    bottom: 7px;
    margin-left: -21px;
  }
}
</style>


<script>
import NicFormComponentMixin from './mixins/NicFormComponentMixin.vue';
import NicLoaderMixin from './mixins/NicLoaderMixin.vue';
import NicLabelMixin from './mixins/NicLabelMixin.vue';
import NicDataListMixin from './mixins/NicDataListMixin.vue';

export default {
  name: 'nic-select',
  mixins: [
    NicLoaderMixin,
    NicLabelMixin,
    NicDataListMixin,
    NicFormComponentMixin
  ],
  props: {
    noNull: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isDisabled() {
      return this.disabled || this.isLoading;
    }
  },
  created() {
    if (this.noNull && !this.value && this.data.length > 0) {
      this.$emit('input', this.fn(this.data[0], this.optionValue)); //this.fn(this.data[0]));
    }
  }
};
</script>

