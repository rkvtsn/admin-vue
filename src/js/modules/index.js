import { faprika } from '@/js/models/index.js';
function register(m, store, router) {
  router.addRoutes(m.routes());
  // router.$add(m.routes);
  for (let storeName of Object.keys(m.store)) {
    store.registerModule(storeName, m.store[storeName]);
  }
  if (m.models) {
    faprika.add(m.models);
  }
  store.dispatch('addModule', m.routes);
}
export default register;
export { register };
