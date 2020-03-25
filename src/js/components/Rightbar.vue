<template>
  <div ref="rightbarComponent" class="sidebar rightbar" :class="{'sidebar-pinned': isPinned}" v-show="value !== ''">
    <!-- <div class="rightbar__header">
      <button @click.stop.prevent="pin">закрепить</button>
    </div> -->
    <nic-rightbar>
      <slot></slot>
    </nic-rightbar>
  </div>
</template>


<style lang="less">
  .rightbar {
    width: 30%; 
    box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 5px;
  }
  // .sidebar-pinned {
  //   display: inline-block;
  //   position: relative !important;
  // }
</style>


<script>
export default {
  name: 'rightbar',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPinned: true
    }
  },
  watch: {
    // value(v) {
    //   if (v !== '') {
    //     document.addEventListener('click', this.rightbarLeave, false);
    //   }
    // }
  },
  beforeDestroy: function() {
    // document.removeEventListener('click', this.rightbarLeave, false);
  },
  methods: {
    pin() {
      
    }
    // TODO: пинер - прикреалять/откреплять
    // rightbarLeave(e) {
    //   if (!this.$refs.rightbarComponent.contains(e.target)) {
    //     this.$emit('input', '');
    //     document.removeEventListener('click', this.rightbarLeave, false);
    //   }
    // }
  },
};
</script>
