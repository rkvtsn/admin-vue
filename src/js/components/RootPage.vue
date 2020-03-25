<template>
  <div class="root_page">
    <keep-alive>
      <router-view :key="$route.fullPath" :meta="$route.meta"></router-view>
    </keep-alive>
  </div>
</template>
