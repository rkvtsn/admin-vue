<template>
  <div :class="classes"
       class="NicCheckbox NicForm__Component">
    <slot name="label">
      <label :for="labelId"
             class="NicLabel NicForm__ComponentLabel"
      >{{textLabel}}</label>
    </slot>

    <div class="NicCheckbox__Item">
      <input type="checkbox"
             :id="labelId" :name="labelId"
             :disabled="disabled"
             :value="false"
             v-model="v" />
             {{value}}
      <label :for="labelId"
             class="NicLabel NicLabel-radio">{{optionText}}</label>
    </div>
  </div>

</template>

<style lang="scss" scoped>
  .NicCheckbox {
    
    .NicLabel {
      max-width: none;
      min-width: auto;
    }
    &__Item {
      display: flex;

      align-items: center;

      input {
        margin: 0;

        &:focus {
          outline: none !important;
        }
      }

      .NicLabel {
        text-align: left;
      }
    }
  }
</style>

<script>
  import NicLoaderMixin from "./mixins/NicLoaderMixin";
  import NicLabelMixin from "./mixins/NicLabelMixin";
  import NicFormComponentMixin from "./mixins/NicFormComponentMixin";


  export default {
    mixins: [NicLoaderMixin, NicLabelMixin, NicFormComponentMixin],

    install(Vue) {
      Vue.component('nic-checkbox', this);
    },

    props: {
      value: {default: () => false},
      optionText: {default: ''},
      disabled: Boolean
    },
    data() {
      return {v: this.value};
    },
    watch: {
      v(v) {this.$emit('input', v);}
    }
  };
</script>
