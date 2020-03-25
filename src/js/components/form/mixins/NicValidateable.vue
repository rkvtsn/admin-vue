<script>

export default {

  props: {
    validation: {
      type: Object,
      default: () => null
    },
    value: {
      type: [Number, String],
      default: ''
    },
  },

  data: function() {
    return {
      isError: false,
      metaClasses: {}
    };
  },

  created() {
    if (this.validation) {
      this.$set(this.validation, 'errors', this.validation.errors);
    }
    if (this.validation && Array.isArray(this.validation.meta)) {
      this.metaClasses = {};
      for (let key of this.validation.meta) {
        this.metaClasses[key] = true;
      }
    }
  },

  watch: {
    value(v) {
      this.touchValidation();
    }
  },

  computed: {
    hasErrors() {
      return this.validation && this.validation.errors.length > 0;
    },
    
    inputClasses() {
      return Object.assign(
        {
          'NicForm__Component-HasError': this.hasErrors,
        },
        this.metaClasses,
        this.classes
      );
    }
  },

  methods: {
    onInput(e) {
      this.touchValidation();
      if (e instanceof Event) {
        this.$emit('input', e.target.value);
      } else {
        this.$emit('input', e);
      }
    },
    touchValidation() {
      this.isError = false;
      if (this.validation) {
        this.validation.$touch();
        this.$nextTick(() => {
          this.isError = this.validation.errors.length > 0;
        });
      }
    }
  }

};

</script>
