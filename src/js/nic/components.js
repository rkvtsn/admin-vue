// Совместимость с ES6
// импортируем Utils в переменную 'u'
require('./core/utils');
var nicapp = require('./app');
var nicmenu = require('./components/menu');
var nicpaginator = require('./components/paginator');
var nicpanel = require('./components/panel');
var nicsearch = require('./components/search');
var nicsection = require('./components/section');
var nicsidebar = require('./components/sidebar');
var nictree = require('./components/tree');
require('./components/table');
var nictable = window.nictable;
var nictab = require('./components/tab');
var nictoobar = require('./components/toolbar');
var nicwell = require('./components/well');
var nicbreadcrumb = require('./components/breadcrumb');
var nicnavbar = require('./components/navbar');
var nicrightbar = require('./components/rightbar');
require('./components/notification');
var nicnotification = window.nicnotification;
export default {
  install(Vue) {
    Vue.use(nictree);
    Vue.use(nicapp);
    Vue.use(nicmenu);
    Vue.use(nicpaginator);
    Vue.use(nicpanel);
    Vue.use(nicsearch);
    Vue.use(nicsection);
    Vue.use(nictable);
    Vue.use(nicsidebar);
    Vue.use(nictab);
    Vue.use(nictoobar);
    Vue.use(nicwell);
    Vue.use(nicbreadcrumb);
    Vue.use(nicnavbar);
    Vue.use(nicnotification);
    Vue.use(nicrightbar);
  }
};
