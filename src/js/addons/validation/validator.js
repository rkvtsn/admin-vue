/**
 * vue.validation.validator.js for NIC
 * Валидатор
 * @author arukavitsyn
 *
 */
import Vue from 'vue';


/**
 * Получение данных из объекта через квадратные скобки
 * @param {Object} obj объект модели
 * @param {String} desc описание пути к данным (например, 'user.birthday.year')
 */
function getDescendantProp(obj, desc) {
  let arr = desc.split('.');
  while (arr.length && (obj = obj[arr.shift()]));
  return obj;
}


// TODO: пробросить колбэк с установкой значений по умолчанию из модели
/**
 * Установка нулевого значения в объекте через квадратные скобки
 * для массива []
 * для всего остального null
 * @param {Object} obj объект модели
 * @param {String} desc описание пути к данным (например, 'user.birthday.year')
 */
function setDefaultDescendantProp(obj, desc) {
  var arr = desc.split('.');
  var last = arr.pop();
  while(arr.length && (obj = obj[arr.shift()]));
  if (Array.isArray(obj[last])) {
    obj[last] = [];
  } else {
    obj[last] = null;
  }
}


/**
 * Проверка значений в соответсвии с установленным ограничением @constrains для значения @payload
 * @param {*} payload значение
 * @param {Function[]} constrains массив функций с ограничениями
 */
let validate = function(payload, constrains, $ctx, $v) {
  let result = {isValid: true, errors: [], meta: []};
  for (let i = 0; i < constrains.length; i++) {
    let r = constrains[i](payload, $ctx, $v);
    if (r.meta) { result.meta.push(r.meta); }
    if (r.result !== null && r.result.length > 0) {
      result.isValid = false;
      if (Array.isArray(r.result)) {
        for (let e of r.result) {
          result.errors.push(e);
        }
      } else {
        result.errors.push(r.result);
      }
    }
  }
  return result;
};


/**
 * @class Валидатор
 * @param {Object} vdata модель данных
 * @param {Array} params параметры валидации
 */
const Validator = function(vdata, params) {
  // Initialization
  let keys = Object.keys(params);
  let $validator = (this || {});
  // reset
  Vue.set($validator, 'isValid', true);
  Vue.set($validator, 'touched', false);
  // $validator.isValid = true;

  validationProcess($validator, vdata, params);

  $validator.$untouch = (flag=true) => {
    for (let i in keys) {
      if (flag) setDefaultDescendantProp(vdata, keys[i]);
      $validator[keys[i]].$untouch();
    }
  };

  $validator.$clear = (flag=true) => {
    $validator.isValid = false;
    $validator.touched = false;
    $validator.$untouch(flag);
  };

  $validator.$check = () => {
    validationProcess($validator, vdata, params);
    return $validator;
  };
  return $validator;
};


function validationProcess($validator, vdata, params) {
  let setTouch = (key, value) => {
    $validator.touched = value;
    $validator[key].touched = value;
  };


  let untouch = (key) => {
    return function() {
      setTouch(key, false);
    };
  };

  let touch = (key) => {
    return () => {
      setTouch(key, true);
      validationProcess($validator, vdata, params);
    };
  };

  // reset isValid
  $validator.isValid = true;

  // validation process
  let keys = Object.keys(params);
  for (let i in keys) {
    let key = keys[i];
    if (!$validator[key]) {
      Vue.set($validator, key, {
        isValid: true,
        meta: [],
        errors: [],
        touched: false
      });
      $validator[key].$touch = touch(key);
      $validator[key].$untouch = untouch(key);
    }

    let prop = getDescendantProp(vdata, key);
    let validObj = validate(prop, params[key], $validator[key], $validator);

    $validator[key].isValid = validObj.isValid;
    $validator[key].meta = validObj.meta;

    $validator[key].errors = [];
    if ($validator[key].touched == true) {
      for (let e of validObj.errors) {
        $validator[key].errors.push(e);
      }
    }

    if (!$validator[key].isValid) {
      $validator.isValid = false;
    }
  }

}


export {
  Validator
};
