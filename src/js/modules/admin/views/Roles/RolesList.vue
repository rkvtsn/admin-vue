<template>
  <table-layout :tableColumns="tableColumns" type="roles"></table-layout>
</template>

<script>
import TableLayout from '@/js/components/TableLayout.vue';

export default {
  data: function() {
    return {
      tableColumns: [
        { key: 'name', text: 'Наименование' },
        { key: 'comment', text: 'Описание' }
      ]
    };
  },
  components: {TableLayout}
};
</script>
