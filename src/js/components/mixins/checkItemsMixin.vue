<script>
export default {
  data() {
    return {

    };
  },
  methods: {
    checkAll(e) {
      for (let item of this.items) {
        // item.checked = e.target.checked;
      }
    },
  },
  computed: {
    isAllChecked() {
      // if (this.items.filter.length === 0) {
      //   return false;
      // }
      return this.items.filter(x => x.checked === false).length === 0;
    }
  },

};
</script>
