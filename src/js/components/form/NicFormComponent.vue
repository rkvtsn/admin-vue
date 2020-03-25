<template>
  <div class="NicForm__Component">
    <slot></slot>
  </div>
</template>


<script>
  import NicFormComponentMixin from './mixins/NicFormComponentMixin.vue';

  export default {
    mixins: [NicFormComponentMixin],
    name: 'nic-form-component'
  };
</script>
