<template>
  <div class="Admin__Roles-View">
    <ul style="list-style-type: none;">
      <li>Наименование: {{ role.name }}</li>
      <li>Описание: {{ role.comment }}</li>
    </ul>

    <h2>Назначенные права</h2>
    <nic-table class="table table-bordered"
               :data="role.rightList"
               :columns="tableColumns" />

    <div slot="footer">
      <div class="NicForm__BottomToolbar">
        <button type="button"
                class="btn btn-default"
                @click.stop.prevent="goBack">Назад</button>
      </div>
    </div>
  </div>
</template>

<script>
import models from '@/js/models';

export default {
  data() {
    return {
      role: new models.admin.Role(),
      rights: [],
      tableColumns: [
        { key: 'name', text: 'Наименование' },
        { key: 'comment', text: 'Описание' }
      ]
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'RolesList.vue' });
    },
    fetchData() {
      this.$store.dispatch('rights/list').then(r => {
        this.$store.dispatch('roles/get', this.$route.params.id).then(x => {
          this.rights = r.content;
          this.role.$reset(x);
        });
      });
    }
  },
  activated() {
    this.fetchData();
  },
};
</script>
