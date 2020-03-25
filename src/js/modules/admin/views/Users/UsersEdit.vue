<template>
  <div class="Admin__Users-Edit">
    <nic-form :validation="user.$validator"
              @submit="submit"
              @cancel="goBack">

      <nic-input label="ФИО"
                 :maxlength="250"
                 :validation="user.$validator.fullName"
                 v-model="user.fullName"></nic-input>

      <nic-input label="Имя пользователя"
                 :maxlength="32"
                 :validation="user.$validator.userName"
                 v-model="user.userName"></nic-input>

      <nic-input label="Пароль"
                 type="password"
                 :maxlength="32"
                 :validation="user.$validator.password"
                 v-model="user.password"></nic-input>

      <nic-input label="Подтверждение пароля"
                 type="password"
                 :maxlength="32"
                 :validation="user.$validator.repassword"
                 v-model="user.repassword"></nic-input>

      <h2>Настройка ролей</h2>
      <table-moveable :source="roles"
                      :target="user.roleList"
                      :headers="['Все роли', 'Назначенные роли']"
                      :columns="tableColumns"></table-moveable>

    </nic-form>
  </div>
</template>

<script>
import TableMoveable from '@/js/components/TableMoveable.vue';
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
      this.user.$reset();
    },
    submit(e) {
      this.$store
        .dispatch('users/update', this.user)
        .then(e => {
          this.goBack();
        })
        .catch(e => {
          this.$error(e);
        });
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
  components: {
    'table-moveable': TableMoveable
  }
};
</script>
