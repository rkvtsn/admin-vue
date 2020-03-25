<template>
  <div>
    <slot></slot>
  </div>
</template>


<script>
export default {
  name: 'step-link',
  methods: {
    onClick(step) {
      
    },
    setStep(step) {
      this.$emit('set-step', step);
    }
  }
};
</script>
