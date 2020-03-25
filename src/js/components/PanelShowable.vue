<style lang="scss">
.panel_showable {
  margin: 4px 0;
  &.bordered.showed {
    border: 1px solid #b7bec5;
  }
  &.showed {
    &Title {
      border-bottom: none;
    }
  }
  &Title {
    min-width: 200px;
    display: inline-block;
    cursor: pointer;
    padding: 2px 4px;
    background: #6499b9;
    color: #fff;
    &:hover,
    &:focus {
      .sprite.sprite-plus {
        background-position: -100px 0;
      }
      .sprite.sprite-minus {
        background-position: -140px 0;
      }
    }
    &Text {
      margin-right: 4px;
    }
  }
  &Content {
    margin-top: -1px;
    border: 1px solid #6499b9;
    padding: 15px;
  }
}
</style>

<template>
  <div class="panel_showable"
       :class="{'bordered': bordered, 'showed': component.isShow}">
    <div @click.stop.prevent="() => component.toggle()"
         class="panel_showableTitle">
      <span class="panel_showableTitleText">
        <slot name="title">{{title}}</slot>
      </span>
      <span class="panel_showableTitleButton pull-right sprite sprite-medium"
            :class="(component.isShow) ? 'sprite-minus' : 'sprite-plus'"></span>
      <span class="clearfix"></span>
    </div>

    <div v-show="component.isShow">
      <div class="panel_showableContent">
        <slot></slot>
      </div>
    </div>
  </div>
</template>




<script>
import Showable from '@/js/components/mixins/Showable';

export default {
  name: 'panel',
  props: {
    bordered: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      component: new Showable([]),
    };
  }
};
</script>

