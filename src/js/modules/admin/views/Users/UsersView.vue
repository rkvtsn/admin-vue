<template>
  <div class="Admin__Users-View">

    <ul style="list-style-type: none;">
      <li>ФИО: {{ user.fullName }}</li>
      <li>Имя пользователя: {{ user.userName }}</li>
    </ul>

    <h2>Назначенные роли</h2>
    <nic-table class="table table-bordered"
               :data="user.roleList"
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
import { models } from '@/js/models';

export default {
  data() {
    return {
      user: new models.admin.User(),
      roles: [],
      userData: null,
      tableColumns: [
        { key: 'name', text: 'Наименование' },
        { key: 'comment', text: 'Описание' }
      ]
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'UsersList.vue' });
    },
    fetchData() {
      this.$store.dispatch('roles/list').then(r => {
        this.$store.dispatch('users/get', this.$route.params.id).then(x => {
          this.roles = r.content;
          this.user.$reset(x);
        });

      });
    }
  },
  activated() {
    this.fetchData();
  },
};
</script>

