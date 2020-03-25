<template>
  <div class="vsm-item"
       :class="[{'open-item' : show}, {'active-item' : active }, {'parent-active-item' : childActive}]">
    <template v-if="!item.children || !item.children.length">
      <template v-if="item.name">
        <router-link class="vsm-link"
                     :style="padding"
                     :to="{name: item.name}"
                     :disabled="item.disabled">
          <i v-if="item.icon"
             class="vsm-icon"
             :class="item.icon"></i>
          <span class="vsm-title">{{item.meta.title}}</span>
        </router-link>
      </template>
      <template v-else>
        <a class="vsm-link"
           :href="item.href"
           :disabled="item.disabled">
          <i v-if="item.icon"
             class="vsm-icon"
             :class="item.icon"></i>
          <span class="vsm-title">{{item.meta.title}}</span>
        </a>
      </template>
    </template>
    <template v-else>
      <div class="vsm-link"
           :style="padding"
           @click="toggleDropdown">
        <i v-if="item.icon"
           class="vsm-icon"
           :class="item.icon"></i>
        <span class="vsm-title">{{item.meta.title}}</span>
        <i class="vsm-arrow icon-right-open"
           :class="{'open-arrow' : show}"></i>
      </div>
      <div class="vsm-dropdown">
        <transition name="show-animation">
          <div class="vsm-list"
               v-if="show">
            <item v-for="(subItem, index) in item.children"
                  :item="subItem"
                  :key="index"
                  :level="level+1" />
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>

<script>
import Item from './Item.vue';
import { itemMixin } from '../mixin';

export default {
  data() {
    return {
      show: false,
    };
  },
  mixins: [itemMixin],
  props: {
    item: Object
  },
  components: {
    Item
  },
  beforeCreate() {
    this.$options.components.Item = require('./Item.vue').default;
  }
};
</script>
