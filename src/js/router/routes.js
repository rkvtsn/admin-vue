import Index from '@/js/views/Index';
import NotFound from '@/js/views/Errors/NotFound';
import LoginForm from '@/js/views/Login/LoginForm';
import HelpViewerForm from '@/js/modules/admin/views/Help/ViewerForm';
import HelpPrintForm from '@/js/modules/admin/views/Help/PrintForm';

const coreRoutes = [
  {
    path: '/',
    name: 'Index.vue',
    helpKey: 'MAIN',
    component: Index,
    meta: {
      helpKey: 'MAIN',
      title: 'Функциональные модули'
    }
  },
  {
    path: '/login',
    name: 'LoginForm.vue',
    component: LoginForm,
    meta: { requiresAuth: false }
  },
  {
    path: '/helpitems/:helpKey',
    name: 'HelpNicedit.vue',
    component: HelpViewerForm,
    meta: {
      permissions: ['HELP_VIEW', 'HELP_EDIT'],
      title: 'Справка'
    }
  },
  {
    path: '/helpitems/print/:helpKey',
    name: 'HelpPrint.vue',
    component: HelpPrintForm,
    meta: {
      permissions: ['HELP_VIEW', 'HELP_EDIT'],
      title: 'Справка'
    }
  },
  {
    path: '*',
    name: 'NotFound.vue',
    component: NotFound,
    meta: { requiresAuth: false, title: 'Ошибка 404' }
  }
];

export default coreRoutes;
