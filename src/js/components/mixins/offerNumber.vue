<script>


function sortByNumber(x, y, ord) {
  let a = parseFloat(`${x.number || 0}.${x.subNumber || 0}`);
  let b = parseFloat(`${y.number || 0}.${y.subNumber || 0}`);
  if (a === b) {
    if (x.cipher === y.cipher)  {
      return (x.name > y.name ? 1 : -1) * ord;
    }
    return (x.cipher > y.cipher ? 1 : -1) * ord;
  }
  return (a > b ? 1 : -1) * ord;
}

export default {

  filters: {
    offerNumber: function(number, subNumber) {
      if (!number && !subNumber) return '-';
      else if (!subNumber) return `${number || '-'}`;
      return `${number || '-'}.${subNumber || '-'}`;
    }
  },

  methods: {

    offerNumberFilter(n, sn) {
      return this.$options.filters.offerNumber(n, sn);
    },

    sort(array, {property='number', direction='asc'} = {}, columns=[]) {
      // console.log({property, direction});
      let ord = (direction === 'asc') ? 1 : -1;
      if (property === 'number') {
        return array.sort(function(x, y) { 
          return sortByNumber(x, y, ord);
        });
      } else if (property === 'duration') {
        return array.sort(function(x, y) {
          let a = Number(x.finish) - Number(x.start);
          let b = Number(y.finish) - Number(y.start);
          let res = (a - b);
          if (res === 0) {
            return sortByNumber(x, y, ord);
          }
          return res * ord;
        });
      }
      return array.sort(function(x, y) {
        let res = 0;
        if (property === 'price') {
          res = (Number(x.estimation.price) - Number(y.estimation.price));
        } else if (property === 'workType') {
          if (x.workType.name === y.workType.name) {
            res = 0;
          } else {
            res = ((x.workType.name > y.workType.name) ? -1 : 1);
          }
        } else {
          res = ((x[property] > y[property]) ? -1 : 1);
        }
        if (res === 0) return sortByNumber(x, y, ord);
        return res * ord;
      });
    }
  }

};
</script>

