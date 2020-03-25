<script>

import offerNumber from "@/js/components/mixins/offerNumber";

export default {

  mixins: [offerNumber],

  data() {
    return {
      offerFilters: {},
    };
  },

  methods: {

    filter(offer) {
      for (let filterEntry of Object.values(this.offerFilters)) {
        const filterMatches = this.filterSingleFilterEntry(filterEntry, offer);
        if (!filterMatches) {
          return false;
        }
      }
      return true;
    },

    filterSingleFilterEntry(filterEntry, offer) {
      if (filterEntry.value === '' || filterEntry.value === null) {
        return true;
      }

      const valueWhichToCompare = (filterEntry.expr) ? filterEntry.expr(offer) : offer[filterEntry.key];
      if (valueWhichToCompare === undefined || valueWhichToCompare === '') {
        return false;
      }

      switch (filterEntry.filterMethod) {
        case '>':
          return parseFloat(valueWhichToCompare) >= parseFloat(filterEntry.value);
        case '<':
          return parseFloat(valueWhichToCompare) <= parseFloat(filterEntry.value);
        case '=':
          return parseFloat(valueWhichToCompare) === parseFloat(filterEntry.value);
        default:
          return String(valueWhichToCompare).includes(filterEntry.value);
      }
    },

  },

};
</script>
