/**
 * vue.validation.validationRules.js for NIC
 * Правила валидации
 * @author arukavitsyn
 *
 */


// TODO: возможно заменить все на классы...


/**
 *
 * Правило - длина значения в интервале (включено min <= value.length <= max)
 * @param {Object} rule - правило валидации
 * @param {string} rule.msg - сообщение при ошибке
 * @param {number} rule.min - минимальное значение
 * @param {number} rule.max - максимальное значение
 *
 */
const range = function({msg, min='', max=''} = {}) {
  if (max === '') {
    max = Number.MAX_SAFE_INTEGER;
  }
  if (min === '') {
    min = Number.MIN_SAFE_INTEGER;
  }
  if (!msg) {
    msg = `Длина должна быть${(min !== Number.MIN_SAFE_INTEGER) ? ` не меньше ${min}` : ''}${(max !== Number.MAX_SAFE_INTEGER) ? ` не больше ${max}`: '' }`;
  }
  return constraint(
    {
      msg,
      closure: (value) => {
        if (typeof (value) === 'undefined' || value === null || value === '') { return true; }
        return (value.length && value.length <= max && value.length >= min);
      }
    }
  );
};

/**
 * Правило - Обязательное поле
 * @param {Object} rule - правило
 * @param {string} rule.msg - сообщение
 */
const required = ({msg}={}) => constraint(
  {
    msg: msg || 'Обязательное поле',
    meta: 'required',
    closure: (x) => (x !== null && typeof x !== 'undefined' && String(x).trim() !== '')
  }
);

/**
 * Правило - Должно быть число
 * @param {*} param0
 */
const number = function({msg, min='', max=''} = {}) {
  if (min === '' || min === null) {
    min = Number.MIN_SAFE_INTEGER;
  }
  if (max === '' || max === null) {
    max = Number.MAX_SAFE_INTEGER;
  }
  if (!msg) {
    msg = `Значение поля должно быть число${(min !== Number.MIN_SAFE_INTEGER) ? ` от ${min}` : ''}${(max !== Number.MAX_SAFE_INTEGER) ? ` до ${max}`: '' }`;
  }
  return constraint(
    {
      msg,
      closure: (value) => {
        if (typeof (value) === 'undefined' || value === null || value === '') { return true; }
        if (isNaN(value)) { return false; }
        return Number(value) <= max && Number(value) >= min;
      }
    }
  );
};

/**
 * Правило - Список не может быть пустым
 * @param {*} param0
 */
const notEmpty = function({msg} = {}) {
  if (!msg) {
    msg = `Список не может быть пустым`;
  }
  return constraint({
    msg,
    closure: (value) => {
      if (Array.isArray(value)) { return value.length > 0; }
      return false;
    }
  });
};

/**
 * Правило - Значение должно совпадать с полем
 * @param {*} param0
 */
const same = function({msg, src, fieldName=''}) {
  if (!msg) {
    msg = `Значение должно совпадать с полем ${fieldName}` ;
  }
  return constraint({
    msg,
    closure: (value) => {
      return value === src();
    }
  });
};

/**
 * Правило - Значение должно ANY
 * @param {*} param0
 */
const any = function({msg, fn, ruleText=''}) {
  if (!msg) {
    msg = `Значение должно ${ruleText}` ;
  }
  return constraint({
    msg,
    closure: (value) => {
      // if (value == '' || value == null || value === undefined) return true;
      return fn(value);
    }
  });
};

/**
 * Опциональное правило, в зависимости от условия в @fn
 * @param {*} v - значение
 * @param {Function} fn - условие при котором правило должно проверяться
 */
const optional = function(v, fn) {
  return (value) => {
    if (!fn(value)) {
      return {
        result: null,
        message: '',
        meta: ''
        };
      }
    if (!Array.isArray(v)) {
      return v(value);
    }
    let result = [];
    let meta = [];
    let message = [];
    for (let c of v) {
      let r = c(value);
      if (r.meta && Array.isArray(r.meta)) {
        meta = meta.concat(r.meta);
      } else {
        if (r.meta) {
          meta.push(r.meta);
        }
      }
      message.push(r.message);
      if (r.result !== null)
        result.push(r.result);
    }
    return {
      meta,
      result,
      message
    };
  };
};

/**
 * @constructor Условия для правила
 * @param {Object} params - параметры
 * @param {Function} params.closure
 * @param {string} params.msg - текст ощибки по умолчанию
 * @param {string} params.meta - метаданные
 */
const constraint = ({closure, msg, meta}, $ctx, $v) => {
  return (value, $ctx, $v) => {
    let result = closure(value, $ctx, $v);
    return {
      meta,
      message: msg,
      result: (result) ? null : msg
    };
  };
};

export {
  same,
  any,
  optional,
  notEmpty,
  range,
  number,
  constraint,
  required
};
