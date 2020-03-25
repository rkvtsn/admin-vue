<template>
  <transition name="modal"
              v-if="active">
    <div class="modal-mask">
      <div class="modal-wrapper"
           @click.self.stop.prevent="onClose">

        <div class="modal-container"
             :style="{height: height, maxWidth: (maxWidth) ? maxWidth : ''}"
             :class="{'modal-container-large': size === 'large'}">

          <div class="modal-header">
            <div @click.stop.prevent="onClose"
                 class="modal-close-btn"><i class="sprite sprite-small sprite-close-white"></i></div>
            <h4 class="modal-title"
                style="padding-left: 3px; padding-top: 1px;">{{title}}</h4>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped lang="less">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-header {
  padding: 0;
  height: 23px;
  background: #b7bec5;
  // border: 1px solid #ccc;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 0px;
  background-color: #fff;
  border: 1px solid #b7bec5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  &-large {
    width: 80%;
  }
}

.modal-close-btn {
  background-color: #cd4141;
  width: 30px;
  height: 20px;
  cursor: pointer;
  float: right;
  text-align: center;
  position: relative;
  top: -1px;
  border: solid 1px #b7bec5;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>


<script>
export default {


  name: 'modal-window',
  

  props: {
    maxWidth: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '300px'
    },
    active: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large'
    },
    title: {
      type: String,
      default: ''
    },
  },


  data: function() {
    return {
      //
    };
  },


  computed: {
    className() {
      return `modal-${(this.size === 'small') ? 'sm' : 'lg'}`;
    }
  },


  methods: {

    onClickCloseBtn() {
      this.$emit('cancel');
    },

    onClose(e) {
      this.$emit('close');
    }

  }

};
</script>

