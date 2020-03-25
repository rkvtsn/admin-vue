<template>
  <div class="v-sidebar-menu"
       :class="[!isCollapsed ? 'vsm-default' : 'vsm-collapsed']"
       :style="{'width': sidebarWidth}"
       @mouseleave="mouseLeave">
    <!-- <button class="btn btn-small" @click="toggleCollapse">|||</button> -->
    <div class="vsm-list"
         :style="[{'height' : '100%'}, {'overflow' : 'hidden auto'}]">
      <template v-for="(item, index) in menu">
        <template v-if="item.header">
          <div v-if="!isCollapsed"
               :key="index"
               class="vsm-header">{{item.meta.title}}</div>
        </template>
        <item v-else
              :key="index"
              :item="item"
              :firstItem="true"
              :isCollapsed="isCollapsed" />
      </template>
    </div>
    <div v-if="isCollapsed"
         :style="[{'position' : 'absolute'}, {'top' : `${mobileItemPos}px`}, {'left' : '0px'}, {'z-index' : 30}, {'width' : width}]">
      <mobile-item :item="mobileItem" />
      <transition name="slide-animation">
        <div class="vsm-mobile-bg"
             v-if="mobileItem"
             :style="[{'position' : 'absolute'}, {'left' : '0px'}, {'right' : '0px'}, {'top' : '0px'}, {'height' : `${mobileItemHeight}px`}]"></div>
      </transition>
      <div class="vsm-dropdown"
           :style="[{'position' : 'absolute'}, {'top' : `${mobileItemHeight}px`}, {'left' : sidebarWidth}, {'right' : '0px'}, {'max-height' : `calc(100vh - ${mobileItemPos + mobileItemHeight}px)`}, {'overflow-y' : 'auto'}]">
        <transition name="show-animation">
          <div class="vsm-list"
               v-if="mobileItem && mobileItem.children">
            <sub-item v-for="(subItem, index) in mobileItem.children"
                      :item="subItem"
                      :key="index" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Item from './Item.vue';
import SubItem from './SubItem.vue';
import MobileItem from './MobileItem.vue';

export default {
  name: 'SidebarMenu',
  components: {
    Item,
    SubItem,
    MobileItem
  },
  props: {
    menu: {
      type: Array,
      required: true
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '300px'
    },
    widthCollapsed: {
      type: String,
      default: '50px'
    }
  },
  data() {
    return {
      sidebarWidth: this.collapsed ? this.widthCollapsed : this.width,
      isCollapsed: this.collapsed,
      mobileItem: null,
      mobileItemPos: 0,
      mobileItemHeight: 0,
      closeTimeout: null
    };
  },

  created() {
    this.updateNavigation(this.menu);

    this.$on('mouseEnterItem', (val) => {
      this.mobileItem = val.item;
      this.mobileItemPos = val.pos;
      this.mobileItemHeight = val.height;
    });

    this.$on('clickItem', () => {
      if (this.closeTimeout) clearTimeout(this.closeTimeout);
      this.closeTimeout = setTimeout(() => {
        this.mouseLeave();
      }, 600);
    });
  },


  methods: {

    mouseLeave() {
      this.mobileItem = null;
    },

    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.sidebarWidth = this.isCollapsed ? this.widthCollapsed : this.width;
      this.$emit('collapse', this.isCollapsed);
    },

    updateNavigation(items) {
      for (let i = 0; i < items.length; i++) {
        items[i].text = items[i].meta.title || items[i].meta.text;
        if (items[i].meta.sidebar !== true || (items[i].meta.permissions && !this.$store.getters.checkPermissions(items[i].meta.permissions))) {
          items.splice(i, 1);
          i--;
        } else if (items[i].children) {
          this.updateNavigation(items[i].children);
        }
      }
    }

  },

};
</script>


<style lang="scss">
@import "../styles/main.scss";
</style>
