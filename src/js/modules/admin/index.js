import routes from './routes';
import users from './store/users';
import roles from './store/roles';
import rights from './store/rights';
import models from './models';

const store = { users, roles, rights, models };

export default {
  routes,
  models,
  store
};

export {
  routes,
  models,
  store
};
