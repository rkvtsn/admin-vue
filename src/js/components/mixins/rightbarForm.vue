<script>
export default {
  
  data: function() {
    return {
      isNewItem: false
    };
  },
  
  props: ['item', 'params'],

  methods: {
    
    resetData(item) {
      if (item && item.$prepare) {
        item = item.$prepare();
      }
      this.formData.$reset(JSON.parse(JSON.stringify(item)));
    },
    
    cancel() {
      this.resetData(this.item);
      this.$emit('cancel');
    },
    
    submit() {
      this.onSubmit();
      this.$emit('submit', this.beforeSubmit());
    },

    onSubmit() {

    },

    beforeSubmit() {
      return this.formData.$prepare();
    },
    
    beforeSet() {
      return this.item;
    },
    
    afterSet() {
      
    }
  },

  created() {
    this.formData.$reset();
    this.isNewItem = this.item === null;
    this.resetData(this.beforeSet());
    this.afterSet();
  },
  
};
</script>
