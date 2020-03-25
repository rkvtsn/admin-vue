<template>
  <div :class="[classes, {'NicCheckboxGroup--tree-mode': treeMode}]"
       class="NicCheckboxGroup NicForm__Component">
    <slot name="label"
          v-if="!treeMode">
      <label :for="labelId"
             class="NicLabel"
             v-if="label">{{textLabel}}</label>
    </slot>
    <div class="NicCheckboxGroup__TreeRootCheckbox"
         v-if="treeMode">
      <label>
        <input type="checkbox"
               @change="toggleSelectionOnAllGroup"
               v-model="treeCheckboxValue"
               :indeterminate.prop="isTreeCheckboxPartiallyChecked">
        {{label}}
      </label>
    </div>

    <div class="NicCheckboxGroup__Group">

      <div :key="key"
           class="NicCheckboxGroup__GroupItem"
           v-for="(item, key) in data">
        <input :id="getUniqueCheckboxLabel(key)"
               :name="getUniqueCheckboxLabel(key)"
               :value="fn(item, optionValue)"
               @change="onInput"
               class="NicCheckboxGroupItem"
               type="checkbox"
               v-model="selectedValue">
        <label :for="getUniqueCheckboxLabel(key)"
               class="NicLabel NicLabel-radio">{{fn(item, optionText)}}</label>
      </div>

    </div>
  </div>

</template>

<style lang="scss">
.NicCheckboxGroup {

  &--tree-mode {
    align-items: flex-start;
    flex-direction: column;
    .NicCheckboxGroup__Group {
      padding-left: 30px;
      flex-direction: column;
      flex: 1 1 100%;
    }
  }

  label {
    --label-height: 30px;
    height: var(--label-height);
    line-height: var(--label-height);
  }

  label.NicLabel.NicLabel-radio {
    text-align: left;
    min-width: auto;
    max-width: none;
  }

  &__TreeRootCheckbox {
    flex: 1 1 100%;
  }

  &__Group {
    display: flex;

    &Item {
      display: inline-block;
      align-items: center;

      & .NicCheckboxGroupItem:focus,
      & .NicCheckboxGroupItem {
        outline: none !important;
      }
    }
  }
}
</style>


<script>
import NicFormComponentMixin from './mixins/NicFormComponentMixin.vue';
import NicLoaderMixin from './mixins/NicLoaderMixin.vue';
import NicLabelMixin from './mixins/NicLabelMixin.vue';
import NicDataListMixin from './mixins/NicDataListMixin.vue';

export default {
  name: 'nic-checkbox-group',
  mixins: [NicLoaderMixin, NicLabelMixin, NicDataListMixin, NicFormComponentMixin],
  props: {
    value: {
      type: [Array],
      default: () => []
    },
    treeMode: false,
  },
  data() {
    return {
      uniqueId: this.generateUniqueLabelId(),
      treeCheckboxValue: false,
      isTreeCheckboxPartiallyChecked: false,
    };
  },

  watch: {
    value: {
      handler: function updateTreeCheckboxState(newCheckedCheckboxes) {
        if (newCheckedCheckboxes.length === 0) {
          this.treeCheckboxValue = false;
          this.isTreeCheckboxPartiallyChecked = false;
        } else if (newCheckedCheckboxes.length === this.data.length) {
          this.treeCheckboxValue = true;
          this.isTreeCheckboxPartiallyChecked = false;
        } else {
          this.treeCheckboxValue = true;
          this.isTreeCheckboxPartiallyChecked = true;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onInput(e) {
      let isChecked = e.target.checked;
      let val = e.target.value;

      if (isChecked) {
        this.$emit('input', this.value.concat([val]));
      } else {
        this.value.splice(this.value.indexOf(val), 1);
      }
    },
    getUniqueCheckboxLabel(key) {
      return `checkbox_${this.uniqueId}_${key}`;
    },
    toggleSelectionOnAllGroup(e) {
      const isChecked = e.target.checked;
      if (isChecked) {
        const result = [];
        for (const checkboxData of this.data) {
          if (checkboxData[this.optionValue] !== undefined) {
            result.push(checkboxData[this.optionValue]);
          } else {
            result.push(checkboxData);
          }
        }
        this.$emit('input', result);
      } else {
        this.$emit('input', []);
      }

    },
  },
};
</script>
