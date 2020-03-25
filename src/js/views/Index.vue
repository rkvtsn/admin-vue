<template>
  <div>
    <h1>Недостаточно прав доступа</h1>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['projectName'],
  methods: {
    chooseModule(m) {
      for (let child of m.children) {
        if (child.meta.permissions && this.checkPermissions(child.meta.permissions)) {
          this.$store.dispatch('addRecentModule', m.meta.title);
          this.$router.push({ name: child.name });
          return;
        }
      }
    }
  },
  computed: {
    ...mapGetters(['checkPermissions', 'currentPermissions']),
    ...mapState(['modules']),
    availableModules() {
      return this.modules.filter(x => {
        return x.meta.permissions && this.checkPermissions(x.meta.permissions);
      });
    },
    recentModules() {
      let result = [];
      for (let moduleName of this.$store.getters.recentModules) {
        let m = this.availableModules.filter(x => x.meta.title === moduleName)[0];
        if (m) { result.push(m); }
      }
      return result;
    }
  },
  created() {
    document.title = this.projectName;
    if (!this.checkPermissions(['CONNECT'])) {
      this.$notify.error('Недостаточно прав доступа', { visibility: 7000 });
      this.$store.dispatch('logout').then(() => { this.$router.push({ name: 'LoginForm.vue' }); });
    }
    if (this.availableModules.length) {
      this.chooseModule(this.recentModules[0] || this.availableModules[0]);
    }
  }
};
</script>
