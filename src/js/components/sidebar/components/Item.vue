<template>
    <div class="vsm-item" :class="[{'first-item' : firstItem}, {'open-item' : show}, {'active-item' : active}, {'parent-active-item' : childActive}]" @mouseenter="mouseEnter($event)">
        <template v-if="!item.children || !item.children.length">
            <template v-if="item.name">
                <router-link class="vsm-link" :style="padding" :to="{name: item.name}" :disabled="item.disabled" @click.native="clickEvent">
                    <i v-if="item.icon" class="vsm-icon" :class="item.icon"></i>
                    <span v-if="!isCollapsed" class="vsm-title">{{item.meta.title}}</span>
                </router-link>
            </template>
            <template v-else>
                <a class="vsm-link" :href="item.meta.to" :disabled="item.disabled">
                    <i v-if="item.icon" class="vsm-icon" :class="item.icon"></i>
                    <span v-if="!isCollapsed" class="vsm-title">{{item.meta.title}}</span>
                </a>
            </template>
        </template>
        <template v-else>
            <div class="vsm-link" :style="padding" @click="toggleDropdown">
                <i v-if="item.icon" class="vsm-icon" :class="item.icon"></i>
                <template v-if="!isCollapsed">
                    <span class="vsm-title">{{item.meta.title}}</span>
                    <i class="vsm-arrow icon-right-open" :class="{'open-arrow' : show}" ></i>
                </template>
            </div>
            <div class="vsm-dropdown" v-if="!isCollapsed">
                <transition name="show-animation">
                    <div class="vsm-list" v-if="show">
                        <sub-item v-for="(subItem, index) in item.children" :item="subItem" :key="index" :level="level+1" />
                    </div>
                </transition>
            </div>
        </template>
    </div>
</template>

<script>
import SubItem from './SubItem.vue';
import { itemMixin } from '../mixin';

export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    firstItem: {
      type: Boolean,
      default: false
    },
    isCollapsed: {
      type: Boolean
    }
  },
  components: {
    SubItem
  },
  mixins: [itemMixin],
  methods: {
    mouseEnter(event) {
      if (this.isCollapsed && this.firstItem) {
          this.$parent.$emit('mouseEnterItem', {
            item: this.item,
            pos:
              event.currentTarget.getBoundingClientRect().top -
              this.$parent.$el.getBoundingClientRect().top,
            height: this.$el.offsetHeight
          });
      }
    },
    clickEvent() {
      if (this.isCollapsed && this.firstItem) {
        this.$parent.$emit('clickItem');
      }
    }
  }
};
</script>

