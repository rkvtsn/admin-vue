<script>
  export default {
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      height: {
        type: [String, Number],
        default: 'auto'
      },
      width: {
        type: [String, Number],
        default: ''
      },
      justify: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      classes() {
        return {
          'NicForm__Component-justify': this.isJustify,
          'NicForm__Component-readonly': this.isReadonly,
          'NicForm__Component-disabled': this.isDisabled,
        };
      },
      isDisabled() {
        return this.disabled;
      },
      isReadonly() {
        return this.readonly;
      },
      isJustify() {
        return this.justify;
      }
    }
  };
</script>
