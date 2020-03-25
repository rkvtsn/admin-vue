<style></style>
.deleted {
  color: #c3c3c3 !important;
}
</style>

<template>
  <div>
    <nic-window title="Активировать пользователя"
                type="dialog"
                icon="question"
                @close="modalActivate = false"
                :active="modalActivate">
      <div>Уверены, что желаете активировать?</div>
      <div slot="footer">
        <button class="btn btn-nic"
                @click="activateItem">Да</button>
        <button class="btn btn-nic"
                @click="modalActivate = false">Нет</button>
      </div>
    </nic-window>

    <table-layout ref="table"
                  v-model="selectedItem"
                  :table-columns="tableColumns"
                  type="users"
                  custom>
      <template slot="toolbar-editable">
        <nic-toolbar-item :disabled="selectedItem === null || !selectedItem.isDeleted"
                          icon="sprite-check"
                          title="Активировать"
                          @click="showModal">
        </nic-toolbar-item>
      </template>
      <template slot="table-template"
                slot-scope="props">
        <td>{{props.fullName}}
          <span class="label label-danger"
                v-if="props.isDeleted">не активен</span>
        </td>
        <td>{{props.userName}}</td>
        <td>{{(new Date(props.updated || 0)).format('d.m.Y H:i:s')}}</td>
      </template>
    </table-layout>

  </div>
</template>


<script>
import TableLayout from '@/js/components/TableLayout.vue';

export default {

  components: { TableLayout },

  data() {
    return {
      modalActivate: false,
      selectedItem: null,
      tableColumns: [
        { key: 'fullName', text: 'ФИО' },
        { key: 'userName', text: 'Имя пользователя' },
        { key: 'updated', text: 'Дата изменения' }
      ],
    };
  },

  methods: {
    showModal() {
      this.modalActivate = true;
    },
    hideModal() {
      this.modalActivate = false;
    },
    activateItem() {
      return this.$store
        .dispatch('users/activate', this.selectedItem.id)
        .then(() => {
          this.modalActivate = false;
          this.$refs.table.list();
        });
    }
  }

};
</script>
