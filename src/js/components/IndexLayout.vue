<template>
  <nic-app-body>

    <div class="sidebar-left"
         slot="sidebar"
         :style="{width: sidebarWidth}">
      <sidebar-menu :width="sidebarWidth"
                    :menu="availableModules"></sidebar-menu>
    </div>

    <div class="mainbar-right"
         slot="mainbar"
         style="height: 100%;">
      <breadcrumbs />
      <router-view :meta="$route.meta"></router-view>
    </div>
    <slot />
  </nic-app-body>
</template>

<style>
.sidebar-left {
  display: inline-block;
}
.mainbar-right {
  padding-top: 5px;
  margin-left: 10px;
  display: inline-block;
  width: calc(100% - 320px);
}
</style>


<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'index-layout',

  components: {
    'sidebar-menu': () => import('@/js/components/sidebar/components/SidebarMenu.vue'),
    'breadcrumbs': () => import('@/js/components/Breadcrumbs.vue')
  },

  props: {
    sidebarWidth: {
      type: String,
      default: '300px'
    }
  },

  computed: {
    ...mapGetters(['checkPermissions', 'currentPermissions']),
    ...mapState(['modules']),
    availableModules() {
      // Сейчас resetModules выполняет только обновление путей
      this.$store.dispatch('resetModules');
      return this.modules.filter(x => {
        return x.meta.permissions && this.checkPermissions(x.meta.permissions);
      });
    },
  },

};
</script>
