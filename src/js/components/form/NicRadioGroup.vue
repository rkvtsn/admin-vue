<template>
  <div :class="classes"
       class="NicRadioGroup NicForm__Component">

    <slot name="label">
      <label :for="labelId"
             class="NicLabel NicForm__ComponentLabel"
             v-if="label">{{textLabel}}</label>
    </slot>

    <div class="NicRadioGroup__Group">

      <div :key="key"
           class="NicRadioGroup__GroupItem"
           v-for="(item, key) in data">
        <input :checked="fn(item, optionValue) == value"
               :id="getUniqueRadioLabel(key)"
               :name="getUniqueRadioLabel(key)"
               :value="fn(item, optionValue)"
               @change="e => $emit('input', e.target.value)"
               class="NicRadioGroupItem"
               type="radio">
        <label :for="getUniqueRadioLabel(key)"
               class="NicLabel NicLabel-radio">{{fn(item, optionText)}}</label>
      </div>

    </div>
  </div>

</template>

<style lang="scss" scoped>
.NicRadioGroup {
  display: flex;

  label.NicLabel.NicLabel-radio {
    text-align: left;
    min-width: 0;
    min-width: auto;
    max-width: none;
  }

  &__Group {
    display: flex;

    &Item {
      display: flex;
      align-items: center;

      & .NicCheckboxGroupItem:focus,
      & .NicCheckboxGroupItem {
        outline: none !important;
      }
    }
  }
}

.NicForm__Component-newline {
  .NicRadioGroup__Group {
    flex-direction: column;
  }
}
</style>


<script>
import NicFormComponentMixin from './mixins/NicFormComponentMixin.vue';
import NicLoaderMixin from './mixins/NicLoaderMixin.vue';
import NicLabelMixin from './mixins/NicLabelMixin.vue';
import NicDataListMixin from './mixins/NicDataListMixin.vue';

export default {
  name: 'nic-radio-group',
  mixins: [NicLoaderMixin, NicLabelMixin, NicDataListMixin, NicFormComponentMixin],
  data() {
    return {
      uniqueId: this.generateUniqueLabelId()
    };
  },
  methods: {
    isChecked(item) {
      return this.value == this.fn(item, this.optionValue);
    },
    getUniqueRadioLabel(key) {
      return `radio_${this.uniqueId}_${key}`;
    }
  }
};
</script>
