<template>
  <div class="NicLoader">
    
    <div :style="{top: radius + 'px', width: radius, height: radius, 'border-width': thin}" class="NicLoader__Spinner"
         v-show="isLoading && !hasSlot">
    </div>
    
    <div class="NicLoader__Target">
      <div class="NicLoader__TargetPanel" v-show="isLoading && hasSlot">
        <div class="NicLoader__TargetPanelItems">
          <div class="NicLoader__TargetPanelItem NicLoader__TargetPanelItem__Spinner"
             :style="{width: radius, height: radius, 'border-width': thin}"></div>
          <div class="NicLoader__TargetPanelItem NicLoader__TargetPanelItem__Text">{{text}}</div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nic-loader',
    props: {
      text: {
        type: String,
        default: 'Идет загрузка данных...'
      },
      isLoading: {
        type: Boolean,
        default: true
      },
      radius: {
        type: String,
        default: '16px'
      },
      thin: {
        type: String,
        default: '3px'
      }
    },
    data() {
      return {
        hasSlot: false
      };
    },
    mounted() {
      this.hasSlot = !!this.$slots.default;      
    }
  };
</script>

<style lang="scss">
  
  $loader-target-bg: rgba(0, 0, 0, 0.2);
  $loader-target-border: 1px solid rgba(0, 0, 0, 0.1);
  $loader-panel-bg: #fff;
  $loader-panel-border: 1px solid #9aa1af;
  $loader-text-color: #1f1f1f;
  $loader-animation: 1.5s infinite;
  $loader-spinner-border: 4px solid #ececec;
  $loader-spinner-border-left: 4px solid #425260;
  

  @-moz-document url-prefix() {
    .NicLoader {
      &__Spinner {
        -moz-box-sizing: border-box;
        padding: 4px;
      }
    }
  }

  .NicLoader.NicLoader-Blue {
      .NicLoader__Spinner,
      .NicLoader__TargetPanelItem__Spinner {
        background: url('./img/loader.gif');
        border: none;
        border-radius: none;
        border-left: none;
        -webkit-animation: none;
        -moz-animation: none;
        animation: none;
      }
      .NicLoader__Target {
        &Panel {
          background: rgba(0, 0, 0, 0.3);
          &Items {
            background: #fff;
            border: 1px solid #9aa1af;
          }
          &Item {
            &__Text {
              color: #1f1f1f;
            }
          }
        }
      }
    }

  .NicLoader {
    &__Spinner,
    &__TargetPanelItem__Spinner {
      z-index: 10;
      // &-Grey {
      //   background: url('./img/loader_grey.gif');
      // }
      border: $loader-spinner-border;
      border-radius: 50%;
      border-left: $loader-spinner-border-left;
      -webkit-animation: spin $loader-animation;
      -moz-animation: spin $loader-animation;
      animation: spin $loader-animation;

    }
    
    &__Target {
      position: relative;
      min-height: 40px;
      &Panel {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100%;
        height: 100%;
        background: $loader-target-bg;
        border: $loader-target-border;
        z-index: 9;
        &Items {
          width: 230px;
          margin: auto;
          max-height: 50px;
          min-height: 20px;
          padding: 2px 15px;
          height: 80%;
          vertical-align: middle;
          display: flex;
          align-items: center;
        
          background: $loader-panel-bg;
          border: $loader-panel-border;
        }
        &Item {
          vertical-align: middle;
          &__Text {
            margin-left: 10px;
            color: $loader-text-color;
          }
        }
      }
    }
  }

  /* Safari */
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @-moz-keyframes spin {
    0% {
      -moz-transform: rotate(0deg);
    }
    100% {
      -moz-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }


</style>
