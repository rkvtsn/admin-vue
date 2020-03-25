<template>
  <div class="Admin__Roles-Create">

    <nic-form :validation="role.$validator" @submit="submit" @cancel="goBack">

      <nic-input placeholder="Наименование"
                 label="Наименование"
                 :maxlength="32" :validation="role.$validator.name"
                 v-model="role.name" />
        
      
      <nic-input :maxlength="255"
                 type="textarea"
                 placeholder="Описание"
                 label="Описание"
                 v-model="role.comment" />
      
      <h2>Настройка прав</h2>
      <table-moveable :source="rights"
                      :target="role.rightList"
                      :headers="['Все права', 'Назначенные права']" :columns="tableColumns"></table-moveable>
      
    </nic-form>
  </div>
</template>

<script>
import models from '@/js/models';
import TableMoveable from '@/js/components/TableMoveable.vue';


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
      this.role.$reset();
    },
    submit(e) {
      this.$store
        .dispatch('roles/create', this.role)
        .then(e => {
          this.goBack();
        }).catch(e => {
          this.$error(e);
        });
    },
    fetchData() {
      this.$store.dispatch('rights/list').then(r => {
        this.rights = r.content;
      });
    }
  },
  activated() {
    this.fetchData();
    this.role.$reset();
  },
  components: { 'table-moveable': TableMoveable }
};
</script>
