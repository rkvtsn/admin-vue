<script>
export default {
  data() {
    return {
      rightbarItem: null,
      rightbarComponentName: '',
      rightbarType: '',
      rightbarParams: '',
      rightbarIsNew: true,
    };
  },

  methods: {
    getCurrentCollection(c = '') {
      return this.rightbarCollections()[c || this.rightbarComponentName];
    },

    onDelete(component, obj) {
      if (this.rightbarItem.id) {
        this.$util.deleteBy(this.getCurrentCollection(component), 'id', this.rightbarItem.id);
      } else {
        if (typeof obj === 'string' || obj instanceof String) {
          this.$util.deleteBy(this.getCurrentCollection(component), obj, this.rightbarItem[obj]);
        } else {
          this.getCurrentCollection(component).splice(obj.selectRowIndex, 1);
        }
      }
    },

    /**
     * objFrom - объект может быть свойством объекта по которому ищем или ref и удаляем по индексу
     */
    rightbarDelete(component, obj) {
      this.showMessageConfirm('Вы уверены, что хотите удалить запись?', (done) => {
        // todo: with promise
        this.onDelete(component, obj);
        done();
      });
    },

    rightbarCancel() {
      this.rightbarComponentName = '';
    },

    rightbarShow(componentName, params = {}) {
      this.rightbarParams = params;
      this.rightbarComponentName = componentName;
    },

    rightbarSelect(type, item) {
      this.rightbarCancel();
      this.rightbarType = type;
    },

    rightbarCreate(componentName, params = {}) {
      this.rightbarCancel();
      this.rightbarIsNew = true;
      this.$nextTick(() => {
        this.rightbarItem = null;
        this.rightbarShow(componentName, params);
      });
    },

    rightbarEdit(componentName, params = {}) {
      this.rightbarIsNew = false;
      this.rightbarShow(componentName, params);
    },

    rightbarSubmit(item) {
      if (!this.rightbarComponentName) return;
      if (this.rightbarIsNew) { //!item.id
        this.rightbarOnCreate(item);
      } else {
        this.rightbarOnEdit(item);
      }
      this.rightbarCancel();
    },

    rightbarOnEdit(item) {
      Object.assign(this.rightbarItem, item);
      item = null;
    },

    rightbarOnCreate(item) {
      this.getCurrentCollection().push(item);
    }

  }



};
</script>
