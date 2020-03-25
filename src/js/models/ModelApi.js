import {API} from '@/js/addons/api';
import Model from './Model.js';

const __api = Symbol('__api');
const __isLoading = Symbol('__isLoading');

class ModelApi extends Model {

  get $controller() {
    throw new Error('Not implemented CONTROLLER field in MODEL');
  }

  constructor({api=API, defaultValue=null, controller=null}={api: API, defaultValue: null, controller: null}) {
    super({defaultValue});
    if (controller === null) {
      controller = this.$controller;
    }
    this[__isLoading] = false;
    this[__api] = api(controller);
  }

  get isLoading() {
    return this[__isLoading];
  }

  set isLoading(v) {
    this[__isLoading] = !!v;
  }

  get api() {
    return this[__api];
  }

  // CRUD
  create(props=null) {
    return this.api.create(this.$prepare(props));
  }
  delete() {
    return this.api.delete(this.id);
  }
  get(id=null) {
    this.isLoading = true;
    return this.api.get(id || this.id).then(x => {
      this.$reset(x);
      this.isLoading = false;
      return x;
    });
  }
  getBy(action, data) {
    this.isLoading = true;
    return this.api.getBy(action, data).then(x => {
      this.$reset(x);
      this.isLoading = false;
      return x;
    });
  }
  update(props=null) {
    return this.api.update(this.$prepare(props));
  }

}

export default ModelApi;
