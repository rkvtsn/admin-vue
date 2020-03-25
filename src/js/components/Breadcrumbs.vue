<template>
  <div>
    <nic-breadcrumb @click="navigate($event.itemkey)">
      <nic-breadcrumb-item :itemkey="'Index.vue'"
                           class="breadcrumbs-active">Главная</nic-breadcrumb-item>
      <nic-breadcrumb-item class="breadcrumbs-active"
                           v-if="item.meta.nobreadcrumbs !== true && item.meta.title !== $route.meta.title"
                           :key="index"
                           :itemkey="item.meta.to || item.name"
                           v-for="(item, index) in $route.matched">{{ item.meta.title }}</nic-breadcrumb-item>
      <nic-breadcrumb-item class="breadcrumbs-deactive">{{ $route.meta.title }}</nic-breadcrumb-item>
    </nic-breadcrumb>
    <h1 v-if="title">{{ (title !== true) ? title : $route.meta.text || $route.meta.title }}</h1>
  </div>
</template>

<style lang="less">
.breadcrumbs {
  &-deactive a {
    text-decoration: none;
    cursor: default;
    &:hover {
      text-decoration: none;
    }
  }
  &-active a {
    color: #000 !important;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

<script>
export default {
  props: {
    title: {
      type: [String, Boolean],
      default: true
    }
  },
  methods: {
    navigate(itemkey) {
      this.$router.push({ name: itemkey });
    }
  }
};
</script>
