import {Validator} from '@/js/addons/validation/validator.js';
import ModelBase from './ModelBase';

const __validator = '__validator';


class ModelValid extends ModelBase {


  $reset(instance=null) {
    let o = instance || this.$defaultValue;
    delete o[__validator];
    let x = super.$reset(o);
    this.$validator.$clear(false);
    this[__validator] = new Validator(this, this.$vRules);
    return x;
  }

  constructor({defaultValue=null, instance=null}={defaultValue: null, instance: null}) {
    super();
    if (!defaultValue) {
      defaultValue = this.$defaultValue;
    }
    super.$reset(instance || this.$defaultValue);
    this[__validator] = new Validator(this, this.$vRules);
  }

  toJSON() {
    let jsonResult = {};
    for (let x in this) {
      if (x !== __validator) {
        jsonResult[x] = this[x];
      }
    }
    return jsonResult;
  }

  get $validator() {
    return this[__validator];
  }

  get $vRules() {
    return {};
  }

  hasErrors(field = null) {
    if (field == null) {
      return false;
    }

    if (Array.isArray(this[field])) {
      if (this[field].length === 0) return false;
      return !this[field].reduce((isValid, x) => isValid && (x.$validator && x.$validator.isValid), true);
    }

    return this[field].$validator && !this[field].$validator.isValid;
  }

}


export default ModelValid;
