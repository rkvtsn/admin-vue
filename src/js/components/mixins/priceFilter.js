let priceFilter = function(
  value,
  zerosCount = 5,
  divider = ' ',
  splitter = '.'
) {
  if (value === null || value === undefined) {
    value = 0;
  }
  zerosCount = zerosCount < 0 ? 0 : zerosCount;
  let fixedValue = (value / 1).toFixed (zerosCount);
  let begin = fixedValue
    .split ('.')[0]
    .replace (/\B(?=(\d{3})+(?!\d))/g, divider);
  let end = fixedValue.split (splitter)[1];
  end = end ? `${splitter}${end}` : '';
  return `${begin}${end}`;
};

export default {
  install(Vue) {
    Vue.filter('price', priceFilter);
    Vue.prototype.priceFilter = priceFilter;
    Vue.priceFilter = priceFilter;
    // todo: global format
    if (!Vue.prototype.$filter || !Vue.$filter) {
      Vue.prototype.$filter = {};
      Vue.$filter = {};
    }
    Vue.$filter['price'] = priceFilter;
  }
};
