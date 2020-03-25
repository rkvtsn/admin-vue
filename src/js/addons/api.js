import {postPromise} from './requests';
import {Object} from 'core-js';

const API = function(controller, actions = CRUD) {
  return new actions (controller);
};

function POST(url, payload = {}) {
  let result = postPromise (`${url}`, payload);
  return result;
}

class CRUD {
  actions = {
    create: 'create',
    read: 'get',
    update: 'update',
    delete: 'delete',
    list: 'list',
  };

  constructor(controller = null) {
    this.isLoading = false;
    this.controller = controller || this.$controller;
    Object.assign (this.actions, this.$actions);

    this.post = this.request;

    // CRUD actions
    this.create = this.add;
    this.read = this.get;
    this.update = this.edit;
    this.delete = this.remove;

    // list/index
    this.index = this.list;
  }

  get $actions() {
    return {};
  }

  get $controller() {
    return '';
  }

  /**
   * Пользовательский запрос
   * @param {String} action
   * @param {HttpPayload} [payload = {}]
   * @param {*} [payload.data]
   * @param {Object} [payload.options]
   * @param {Boolean} [payload.notoken]
   * @param {Boolean} [payload.silent]
   * @param {String} [controller = null]
   */
  request(action, payload = {options: {}}, controller = null) {
    if (controller === null) {
      controller = this.controller;
    }
    this.isLoading = true;
    return postPromise (`${controller}/${action}`, payload).then (r => {
      this.isLoading = false;
      return r;
    });
  }

  /**
   * Получить сущность по url '/get' по ID
   * @param {Number} id
   */
  get(id) {
    return this.request (this.actions.read, {
      data: {
        id,
      },
    }).then (x => {
      return x.data;
    });
  }

  /**
   * Получить сущность по '/action' с параметром data
   * @param {*} action
   * @param {*} data
   */
  getBy(action, data) {
    return this.request (action, {
      data,
    }).then (x => {
      return x.data;
    });
  }

  /**
   * Получить список сущностей
   * @param {Object} params
   * @param {Array} filters - {value, operation, field}
   */
  list(params = {}, filter = null) {
    if (filter) {
      let filters = [];
      for (let fKey of Object.keys (filter)) {
        if (
          filter[fKey].value !== filter[fKey].default &&
          filter[fKey].value !== ''
        ) {
          filters.push ({
            value: filter[fKey].value,
            operation: filter[fKey].operation || 'EQUAL',
            field: filter[fKey].field || fKey,
          });
        }
      }
      if (filters.length > 0) {
        params.params.searchExpression = {logicalOperator: 'AND'};
        params.params.searchExpression.queryCriteria = filters;
      }
    }
    return this.request (this.actions.list, {
      data: params,
    }).then (x => x.data);
  }

  /**
   * Получить типизированный список
   * @param {Model} TClass - тип модели
   * @param {Object} [params={}] - параметры запроса
   * @param {Object} [filter=null] - фильтрация полей
   */
  listT(TClass, params = {}, filter = null) {
    return this.list (params, filter).then (x => {
      let result = [];
      for (let item of x.content) {
        result.push (new TClass ({instance: item}));
      }
      return result;
    });
  }

  add(item) {
    return this.request (this.actions.create, {
      data: item,
    }).then (x => x.data);
  }

  edit(item) {
    return this.request (this.actions.update, {
      data: item,
    }).then (x => x.data);
  }

  remove(id) {
    return this.request (this.actions.delete, {
      data: {
        id,
      },
    }).then (x => x.data);
  }
}
export default API;
export {API, CRUD, POST};
