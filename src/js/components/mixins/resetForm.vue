<script>
export default {
  data: function() {
    return {
      formData: {}
    };
  },
  defaultData: function() {
    return {};
  },
  methods: {
    resetData(object) {
      if (object) {
        this.formData = this.$options.defaultData();
        Object.assign(this.formData, object);
      } else {
        Object.assign(this.$data.formData, this.$options.defaultData());
      }
    }
  }
};
</script>
