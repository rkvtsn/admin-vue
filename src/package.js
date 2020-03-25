import nic from './js/nic/components.js'; // Библиотека компонентов НИЦ
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueMoment from 'vue-moment-tz';
import priceFilter from './js/components/mixins/priceFilter';
import pluralFilter from './js/components/mixins/pluralFilter';
import numberRounder from './js/components/mixins/numberRounder';
import VueUtils from './js/addons/util';
import VTooltip from 'v-tooltip';
import global from './js/addons/global.js';
import Date from './js/addons/Date.js';
import MOComponents from './js/components';
import form, {
  NicDatepicker,
  NicForm,
  NicInput,
  NicSelect,
  NicCheckboxGroup,
  NicRadioGroup,
  NicLoader,
  NicErrorLabel,
  CheckboxGroup,
} from './js/components/form';

const init = function(Vue) {
  Vue.use (pluralFilter);
  Vue.use (priceFilter);
  Vue.use (VueRouter);
  Vue.use (VueUtils);
  Vue.use (VTooltip);

  Vue.filter ('numberRound', numberRounder);

  // Компоненты НИЦ
  Vue.use (nic);
  Vue.use (MOComponents);
  Vue.use (VueResource);

  Vue.component ('nic-datepicker', NicDatepicker);
  Vue.component ('nic-form', NicForm);
  Vue.component ('nic-input', NicInput);
  Vue.component ('nic-select', NicSelect);
  Vue.component ('nic-checkbox-group', NicCheckboxGroup);
  Vue.component ('nic-error-label', NicErrorLabel);
  Vue.component ('nic-radio-group', NicRadioGroup);
  Vue.component ('nic-loader', NicLoader);
  Vue.component ('checkbox-group', CheckboxGroup);

  // Стили
  require ('./css/tooltip.scss');
  require ('./css/bootstrap.min.css');
  require ('./css/nicbootstrap.less');
  require ('./css/style.less');
  require ('./css/description-tooltip.scss');
  require ('./css/master.less');
  require ('./css/scrollbar.less');
  require ('./css/fontello.css');
  require ('./css/fontroboto.css');
  require ('./css/theme/white/variables.scss');
  require ('./css/sprite.scss');

  require ('./favicon.ico');
};

export {init};
export default init;
