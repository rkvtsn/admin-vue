<template>
  <div class="filter_panel">
    <panel-showable>
      <span slot="title">Фильтры<span v-if="value.length">: [{{value.map(x => `"${x.text}"`).join(',')}}]</span>
      </span>
      <div class="form-inline">
        <div class="form-group" v-for="(filterItem, i) in tableColumns" :key="i">
            <label class="checkbox"><input type="checkbox" @click="() => $emit('changed', offerFilter)" v-model="value" :value="filterItem"> {{filterItem.text}}</label>
        </div>
      </div>
      <br/>
      <div class="form-group" :key="index" v-for="(offerFilter, index) in value">
        <valid-input @input="() => $emit('changed', offerFilter)" v-model="offerFilter.value" :label="offerFilter.title"></valid-input>
      </div>
      <div style="text-align: center; font-style: italic;" v-if="value.length === 0">Фильтры не выбраны</div>
    </panel-showable>
  </div>
</template>

<style lang="less">

</style>

<script>
export default {
  components: {
    'panel-showable': () => import('@/js/components/PanelShowable')
  },
  props: {
    tableColumns: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  }
};
</script>

