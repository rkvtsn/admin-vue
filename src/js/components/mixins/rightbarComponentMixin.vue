<script>
export default {
  data: function() {
    return {
      rightbarComponent: '',
      selectedItem: null,
      selectedItemParams: {}
    };
  },
  methods: {
    rightbarCollection() {
      return this.formData[`${this.rightbarComponent}List`];
    },
    rightbarRef() {
      return this.$refs[`${this.rightbarComponent}Component`];
    },
    rightbarOnCreate(item) {
      this.rightbarCollection().push(item);
    },
    rightbarOnEdit(item) {
      Object.assign(this.selectedItem, item);
    },
    rightbarSubmit(item) {
      if (this.rightbarComponent === '') { return; }
      // if ('$v' in item) {
      //   delete item['$v'];
      // }
      if (!item.id) {
        this.rightbarOnCreate(item);
      } else {
        this.rightbarOnEdit(item);
        item = null;
      }
      this.rightbarClear();
    },
    rightbarCancel() {
      this.rightbarClear();
    },
    rightbarClear() {
      this.rightbarComponent = '';
    },
    rightbarSetParams(componentName) {
      Object.assign(this.selectedItemParams, this.selectedItem);
    },
    rightbarShow(componentName) {
      this.rightbarClear();
      this.$nextTick(() => {
        this.rightbarComponent = componentName;
      });
    },
    rightbarShowCreate(componentName) {
      this.rightbarSetParams(componentName);
      this.selectedItem = null;
      this.rightbarShow(componentName);
    },
    rightbarShowEdit(componentName) {
      this.rightbarSetParams(componentName);
      this.rightbarShow(componentName);
    },
    clearSelection(componentName) {
      this.selectedItem = null;
    }
  },
  activated() {
    this.rightbarClear();
  }
};
</script>
