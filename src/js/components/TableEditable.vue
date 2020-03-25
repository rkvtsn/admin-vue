<template>
  <div class="table_editor">
    <nic-window title="Удаление записи"
                icon="question"
                type="dialog"
                @close="modal = false"
                :active="modal">
      <div>Вы уверены, что хотите удалить запись?</div>
      <div slot="footer">
        <button class="btn btn-nic"
                @click.prevent="submitDelete">Да</button>
        <button class="btn btn-nic"
                @click.prevent="submitDeleteCancel">Нет</button>
      </div>
    </nic-window>
    <div v-show="state === 'list'">
      <nic-toolbar>
        <nic-toolbar-item icon="sprite-plus"
                          title="Добавить"
                          @click="goToCreate" />
        <nic-toolbar-item :disabled="selectedItem === null"
                          icon="sprite-pencil"
                          title="Редактировать"
                          @click="goToEdit" />
        <nic-toolbar-item :disabled="selectedItem === null"
                          icon="sprite-cross"
                          title="Удалить"
                          @click="goToDelete" />
      </nic-toolbar>
      <div v-show="data.length > 0">
        <nic-table v-model="selectedItem"
                   class="table-bordered"
                   :data="data"
                   :columns="columns"
                   selectable></nic-table>
      </div>
      <div v-show="data.length <= 0">
        <h5>Список пуст</h5>
      </div>
    </div>
    <div v-show="state === 'create'">
      <h5>Добавление записи:</h5>
      <form>
        <div class="form-group">
          <nic-input :maxlength="150"
                     :validation="item.$validator.name"
                     v-model="item.name"
                     label="Наименование"></nic-input>
        </div>
        <div class="form-group pull-right">
          <button :disabled="!item.$validator.isValid"
                  @click.prevent="submitCreate"
                  class="btn btn-primary"
                  type="submit">Сохранить</button>
          <button @click.prevent="goToList"
                  class="btn btn-default">Отмена</button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
    <div v-show="state === 'edit'">
      <h5>Изменение записи:</h5>
      <form>
        <nic-input :maxlength="150"
                   :validation="item.$validator.name"
                   v-model="item.name"
                   label="Наименование"></nic-input>
        <div class="form-group pull-right">
          <button :disabled="!item.$validator.isValid"
                  @click.prevent="submitEdit"
                  class="btn btn-primary"
                  type="submit">Сохранить</button>
          <button @click.prevent="goToList"
                  class="btn btn-default">Отмена</button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </div>
</template>

<script>

import { required } from '@/js/addons/validation';
import { ModelValid } from '@/js/models';


class Record extends ModelValid {
  get $defaultValue() {
    return {
      name: '',
      id: this.constructor.counter++
    };
  }

  constructor() {
    super();
    this.constructor.counter = (this.constructor.counter || 0) + 1;
    this.id = this.constructor.counter;
  }

  get $vRules() {
    return {
      name: [required()]
    };
  }
}

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      selectedItem: null,
      item: new Record(),
      state: 'list',
      modal: false
    };
  },
  methods: {
    findWithAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    },
    initList() {
      for (let x of this.data) {
        x.id = counter++;
      }
    },
    goToList(event) {
      if (event) event.preventDefault();
      this.state = 'list';
      this.item.$reset();
    },
    goToCreate(event) {
      event.preventDefault();
      this.item.$reset();
      this.state = 'create';
    },
    goToEdit(event) {
      event.preventDefault();
      this.item.$reset(this.selectedItem);
      // this.item.name = this.selectedItem.name;
      // this.item.id = this.selectedItem.id;
      this.state = 'edit';
    },
    goToDelete(event) {
      event.preventDefault();
      this.modal = true;
    },
    submitEdit(event) {
      let item = this.data.filter(x => x.id === this.selectedItem.id)[0];
      let existedItems = this.data.filter(x => x.name === this.item.name);
      if (existedItems.length === 0 || (existedItems.length === 1 && existedItems[0].id === item.id)) {
        item.name = this.item.name;
      } else {
        this.$notify.error('Введенное наименование уже есть в списке', { visibility: 7000 });
      }
      this.goToList(event);
      this.$emit('submit', this.data);
    },
    submitCreate(event) {
      if (this.data.filter(x => x.name === this.item.name).length <= 0) {
        this.data.push(Object.assign({}, this.item));
      } else {
        this.$notify.error('Введенное наименование уже есть в списке', { visibility: 7000 });
      }
      this.goToList(event);
      this.$emit('submit', this.data);
    },
    submitDelete() {
      let i = this.findWithAttr(this.data, 'id', this.selectedItem.id);
      if (i > -1) {
        this.data.splice(i, 1);
      }
      this.modal = false;
      this.$emit('submit', this.data);
    },
    submitDeleteCancel() {
      this.modal = false;
      this.$emit('delete-cancel', this.data);
    }
  },
  created() {
    this.initList();
  }
};
</script>
