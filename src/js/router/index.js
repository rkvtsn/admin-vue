import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import { store } from '../store';

// var Vue = (require('../nic/core/vue')).Vue; // Используем НИЦ версию Vue

Vue.use(Router);

const router = new Router({
  routes
  // mode: 'history'
});


router.beforeEach((to, from, next) => {
  Vue.$debug(to.meta);
  const isAuthorized = store.getters.isAuthorized;
  if (isAuthorized && to.name === 'LoginForm.vue') {
    next('/');
  } else if (to.meta.requiresAuth !== false && !isAuthorized) {
    next({ name: 'LoginForm.vue' });
  } else {
    if (to.meta.permissions && !store.getters.checkPermissions(to.meta.permissions)) {
      next(false);
    } else {
      if (to.meta.redirectTo) {
        next(to.meta.redirectTo);
      } else {
        next();
      }
    }
  }
});


export default router;

export { router, routes };
