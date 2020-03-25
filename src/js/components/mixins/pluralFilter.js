function getPlural(n, [form0, form1, form2]) {
  n = Math.abs (n) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) {
    return form2;
  }
  if (n1 > 1 && n1 < 5) {
    return form1;
  }
  if (n1 == 1) {
    return form0;
  }
  return form2;
}
let pluralFilter = function(n, forms = [form0, form1, form2]) {
  const wordForm = getPlural(n, forms);
  return `${n} ${wordForm}`;
};

export default {
  install(Vue) {
    Vue.filter ('plural', pluralFilter);
    Vue.prototype.pluralFilter = pluralFilter;
    Vue.pluralFilter = pluralFilter;

    if (!Vue.prototype.$filter || !Vue.$filter) {
      Vue.prototype.$filter = {};
      Vue.$filter = {};
    }
    Vue.$filter['plural'] = pluralFilter;
  },
};
