<style lang="scss">
// .NicInput__Item:hover .NicForm__ErrorIcon,
// .NicForm__Error--with-icon {
//   opacity: 0;
// }
</style>

<template>
  <div class="NicForm__Error"
       :class="{'NicForm__Error--with-icon': showIcon}"
       v-if="hasError || (validation && validation.errors.length > 0 && validation.touched)">
    <span class="NicForm__ErrorIcon icon icon-attention-circled form-control-feedback"></span>
    <span v-if="hasSlot"
          class="NicForm__ErrorText">
      <slot></slot>
    </span>
    <template v-else-if="validation">
      <span class="NicForm__ErrorText"
            :key="index"
            v-for="(e, index) in validation.errors">{{e}}</span>
    </template>

  </div>
</template>



<script>
export default {
  name: "nic-error-label",
  props: {
    validation: {
      type: Object,
      default: () => null
    },
    hasError: {
      type: [Boolean, String],
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      hasSlot: false
    };
  },
  mounted() {
    this.hasSlot = !!this.$slots.default;
  }
};
</script>
