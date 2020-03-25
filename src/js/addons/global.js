export default (function(g) {
  g = g || window || {};

  //region global functions n reorders
  /**
   * Escapes the passed string for use in a regular expression
   * @param {String} s
   * @return {String}
   * @global
   */
  function escapeRe(s) {
    return s.replace(/([-.*+?^${}()|[\]/\\])/g, "\\$1");
  }

  let ua = navigator.userAgent.toLowerCase(),
    check = function(r) {
      return r.test(ua);
    },
    DOC = document,
    docMode = DOC.documentMode,
    isStrict = DOC.compatMode == "CSS1Compat",
    isOpera = check(/opera/),
    isChrome = check(/\bchrome\b/),
    isWebKit = check(/webkit/),
    isSafari = !isChrome && check(/safari/),
    isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
    isSafari3 = isSafari && check(/version\/3/),
    isSafari4 = isSafari && check(/version\/4/),
    isIE11 = / rv:11\.0\)/.test(ua),
    isIE = !isOpera && (/msie/.test(ua) || isIE11),
    isIE10 = false,
    isIE9 = false,
    isIE8 = false,
    isIE7 = false,
    isIE6 = false,
    isIE9m = false,
    isIE10p = false,
    isGecko = !isWebKit && check(/gecko/),
    isGecko2 = isGecko && check(/rv:1\.8/),
    isGecko3 = isGecko && check(/rv:1\.9/),
    isBorderBox = isIE && !isStrict,
    isWindows = check(/windows|win32/),
    isMac = check(/macintosh|mac os x/),
    isAir = check(/adobeair/),
    isLinux = check(/linux/),
    isWin_x64 = check(/ win64;/),
    isTabletPC = check(/Tablet PC/),
    isSecure = /^https/i.test(window.location.protocol);

  if (isIE) {
    switch (docMode) {
      case (10):
        isIE10 = true;
        break;
      case (9):
        isIE9 = true;
        break;
      case (8):
        isIE8 = true;
        break;
      case (7):
        isIE7 = true;
        break;
      case (5):
        isIE6 = true;
        break;
      default:
        isIE10 = check(/msie 10/);
        isIE9 = check(/msie 9/);
        isIE8 = check(/msie 8/);
        isIE7 = check(/msie 7/);
        isIE6 = (!isIE7 && !isIE8 && !isIE9 && !isIE10 && !isIE11) || (docMode == 5);
    }
    isIE9m = isIE && (isIE6 || isIE7 || isIE8 || isIE9);
    isIE10p = isIE && !(isIE6 || isIE7 || isIE8 || isIE9);
    isBorderBox = isIE9m && !isStrict;
  }

  /**
   * Returns true if the passed value is a Javascript string, othrwise false
   * @param v
   * @returns {boolean}
   * @global
   */
  function isString(v) {
    return typeof v === 'string';
  }

  /**
   * Returns true if the passed value is a JavaScript array, otherwise false.
   * @param v The value to test
   * @return {Boolean}
   * @global
   */
  function isArray(v) {
    return (Array.isArray ?
      Array.isArray(v) :
      ((v instanceof Array) || Object.prototype.toString.apply(v) === '[object Array]'));
  }

  /**
   * Returns true if the passed value is a number. Returns false for non-finite numbers.
   * @param v The value to test
   * @return {Boolean}
   * @global
   */
  function isNumber(v) {
    return (typeof v === 'number' || parseFloat(v) === v || v instanceof Number) &&
      isFinite(v);
  }

  /**
   * @param v
   * @returns {boolean}
   * @global
   */
  function isObject(v) {
    return Object.prototype.toString.apply(v) === '[object Object]';
  }

  /**
   * Check value as a function.
   * @param {*} v
   * @returns {boolean}
   * @global
   */
  function isFunction(v) {
    return {}.toString.call(v) === '[object Function]';
  }

  /**
   * Returns true if the passed object is a JavaScript date object, otherwise false.
   * @param v The object to test
   * @return {Boolean}
   * @member window
   * @global
   */
  function isDate(v) {
    return Object.prototype.toString.apply(v) === '[object Date]';
  }

  /**
   * Check if value is primitive
   * @global
   */
  function isPrimitive(value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean' ||
      isDate(value)
    );
  }


  /**
   * Returns true if the passed value is empty.
   * <p>The value is deemed to be empty if it is<div class="mdetail-params"><ul>
   * <li>null</li>
   * <li>undefined</li>
   * <li>an empty array</li>
   * <li>a zero length string (Unless the <tt>allowBlank</tt> parameter is <tt>true</tt>)</li>
   * </ul></div>
   * @param v The value to test
   * @param {Boolean} [allowBlank=false] true to allow empty strings
   * @return {Boolean}
   * @global
   */
  function isEmpty(v, allowBlank) {
    if (typeof v === 'boolean') return false;
    let result = false;
    result = (!allowBlank && parseFloat(v) == v ?
        parseFloat(v) === 0 :
        false) ||
      v === null ||
      v === undefined ||
      typeof v === 'unknown' ||
      (isArray(v) ?
        (!allowBlank ?
          !v.length :
          false) :
        false) ||
      (!allowBlank ?
        (isString(v) && v.trim() === '') :
        false);
    if (result) return result;

    if (isDate(v)) result = false;
    else if (isObject(v)) {
      result = true;
      for (let io in v)
        if (v.hasOwnProperty(io)) {
          result = false;
          break;
        }
      if (allowBlank) result = false;
    }
    return result;
  }

  // /**
  //  * define global obj in the path
  //  * @method define
  //  * @global
  //  * @member window
  //  * @param {String} path
  //  * @param {*} obj
  //  * @param {global|window|Object} [parentNS=window]
  //  * @return obj
  //  * @global
  //  */
  // function define(path, obj, parentNS = g) {
  //   function rec(ns, lst) {
  //     if (!lst.length) return ns;
  //     let name = lst.shift();
  //     if (!ns[name]) {
  //       if (lst.length) ns[name] = {};
  //       else ns[name] = obj;
  //     }
  //     rec(ns[name], lst);
  //     return ns;
  //   }

  //   if (!path)
  //     return Object.assign(parentNS, isFunction(obj) ? obj() : obj); // apply(g, obj);
  //   else
  //     return rec(parentNS, path.split('.'));
  // }

  /**
   * After #define() u may get defined something.
   * @param {String} path
   * @param {Object} parentNS
   * @returns {*}
   */
  function getDefined(path, parentNS = g) {
    return path.split('.').reduce(function(ac, n) {
      return (ac && ac[n]) || null;
    }, g);
  }

  /**
   * alternative Object.assign, but this function have more functionalities.
   * This function doesn't assign value if it is equal undefined.
   *
   *  @example
   *  apply(destinationObject, sourceObj, defaultValuesObj, 3)
   *
   * Apply all object values from the right array side to the left to the first object.
   *
   * @member window
   * @param {Array|Object} result object|array
   * @param {Array|Object} src source object|array
   * @param {Array|Object} [def] default values of object|array
   * @param {Number} [deep=0] level deeping
   * @param clone
   * @global
   */
  function apply(result, src, def = null, deep = 0, clone = false) {
    deep = deep > 0 ? deep : 0;
    if (!result) result = Array.isArray(src) ? [] : {};

    const ids = ['id', 'name', 'dataIndex', 'ln', 'ref', 'key'],
      skipApplyProp = ['ownerCt', 'prototype', 'parent'];

    /**
     * Apply default values (like applyIf()).
     * @private
     * @param res
     * @param d
     * @param deep
     * @returns {*}
     */
    function deepApplyDefault(res, d, deep) {
      if (Array.isArray(res)) {
        d.forEach((row, i) => {
          let id = ids.find(f => row.hasOwnProperty(f));
          if (id) {
            if (res.indexOfKey(id, row[id]) === -1)
              res.push(row);
          } else if (deep)
            deepApplyDefault(res[i], row, deep - 1);
        });
      } else if (typeof d === 'object') {
        Object.keys(d).forEach(k => {
          if (!res.hasOwnProperty(k))
            res[k] = d[k];
          else if (deep)
            deepApplyDefault(res[k], d[k], deep - 1);
        });
      } else
        res = d;

      return res;
    }


    if (def) {
      deepApplyDefault(result, def, deep);
    }

    if (Array.isArray(src)) {
      src.forEach((row, p) => {
        if (deep &&
          (typeof (result[p]) === 'object' || typeof (row) === 'object') &&
          (skipApplyProp.indexOf(p) === -1) &&
          (Object.keys(row).some(el => ids.includes(el)))) {

          let id = ids.find(f => row.hasOwnProperty(f));
          let i = result.indexOfKey(id, row[id]);
          if (i > -1)
            apply(result[i], row, null, deep - 1, clone);
          else {
            if (clone)
              result.push(apply({}, row, null, deep - 1), clone);
            else
              result.push(row);
          }

          return;
        }

        let _row;
        if (clone && isObject(row))
          _row = apply(Array.isArray(row) ? [] : {}, row, null, deep - 1, clone);
        else
          _row = row;
        if ((result.length - 1) > p) result.push(_row);
        else result[p] = _row;
      });

    } else if (typeof src === 'object') {
      Object.keys(src).forEach(p => {
        if (deep && (typeof (src[p]) == 'object' && typeof (result[p]) == 'object') &&
          (skipApplyProp.indexOf(p) === -1)) {
          apply(result[p], src[p], null, deep - 1, clone);
        } else
          result[p] = src[p];
      });

    } else
      result = src;

    return result;
  }

  /**
   * @todo: use code from apply#deepApplyDefault
   * This function equal #apply but she doesn't apply value to property the destination object
   *  IF the destination object property has any value.
   * @global
   * @param result
   * @param src
   * @param deep
   * @param clone
   */
  function applyIf(result, src, deep = 0, clone = false) {
    deep = deep > 0 ? deep : 0;
    if (!result) result = Array.isArray(src) ? [] : {};

    const ids = ['id', 'name', 'dataIndex', 'ln', 'ref', 'key'],
      skipApplyProp = ['ownerCt', 'prototype', 'parent'];

    /**
     * Apply default values (like applyIf()).
     * @private
     * @param res
     * @param d
     * @param deep
     * @returns {*}
     */
    function deepApplyDefault(res, d, deep) {
      if (Array.isArray(res)) {
        d.forEach((row, i) => {
          const id = ids.find(f => row.hasOwnProperty(f));
          if (id) {
            if (res.indexOfKey(id, row[id]) === -1)
              res.push(row);
          } else if (deep)
            deepApplyDefault(res[i], row, deep - 1);
        });
      } else if (typeof d === 'object') {
        Object.keys(d).forEach(k => {
          if (!res.hasOwnProperty(k))
            res[k] = d[k];
          else if (deep)
            deepApplyDefault(res[k], d[k], deep - 1);
        });
      } else
        res = d;

      return res;
    }


    deepApplyDefault(result, src, deep);

    // if (Array.isArray(src)) {
    //   src.forEach((row, p) => {
    //     if (deep
    //         && (typeof (result[p]) === 'object' || typeof (row) === 'object')
    //         && (skipApplyProp.indexOf(p) === -1)
    //         && (Object.keys(row).some(el => ids.includes(el)))) {
    //
    //       let id = ids.find(f => row.hasOwnProperty(f));
    //       let i = result.indexOfKey(id, row[id]);
    //       if (i > -1)
    //         applyIf(result[i], row, null, deep - 1, clone);
    //       else {
    //         if (clone)
    //           result.push(applyIf({}, row, null, deep - 1), clone);
    //         else
    //           result.push(row);
    //       }
    //
    //       return;
    //     }
    //
    //     let _row;
    //     if (clone && isObject(row))
    //       _row = apply(Array.isArray(row) ? [] : {}, row, null, deep - 1, clone);
    //     else
    //       _row = row;
    //     if ((result.length - 1) > p) result.push(_row);
    //     else result[p] = _row;
    //   });
    //
    // }
    // else if (typeof src === 'object') {
    //   Object.keys(src).forEach(p => {
    //     if (deep && (typeof (src[p]) == 'object' && typeof (result[p]) == 'object')
    //         && (skipApplyProp.indexOf(p) === -1)) {
    //       apply(result[p], src[p], null, deep - 1, clone);
    //     }
    //     else
    //       result[p] = src[p];
    //   });
    //
    // }
    // else
    //   result = src;

    return result;
  }

  /**
   * Debounce Helper
   * {@see https://remysharp.com/2010/07/21/throttling-function-calls}
   * @param {Function} fn
   * @param {Number} delay
   * @returns {Function}
   * @global
   */
  function debounce(fn, delay) {
    let timer = null;
    return function() {
      const context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  }

  /**
   * Throttle Helper
   * {@see https://remysharp.com/2010/07/21/throttling-function-calls}
   * @param {Function} fn
   * @param [threshhold=3e2]
   * @param {Object} [scope]
   * @returns {Function}
   * @global
   */
  function throttle(fn, threshhold = 3e2, scope = null) {
    let last,
      deferTimer;

    return function() {
      const context = scope || this;

      const now = +new Date,
        args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  /**
   * сравнивает два объекта с учетом вложенностей
   * @param {Array|Object} obj1
   * @param {Array|Object} obj2
   * @param {Boolean} [u=false] строгое соответствие (с приведением типов)
   * @return {Boolean} <dd>false</dd> if not equals
   * @member window
   * @global
   */
  function equals(obj1, obj2, u) {
    if (isPrimitive(obj1) && isPrimitive(obj2))
      return u ? obj1 === obj2 : obj1 == obj2;
    if (!obj1 || !obj2) return u ? obj1 === obj2 : obj1 == obj2;

    let result = true;

    const excluded = ['$$hashKey'],
      keys1 = Object.keys(obj1),
      keys2 = Object.keys(obj2);

    if (obj1 && obj2) {
      if ((obj1.self && obj1.self.$isClass) || (obj2.self && obj2.self.$isClass))
        throw new Error('Функция не предусмотрена для сравнения объектов от классов.');

      let cnt1 = 0,
        cnt2 = 0;
      keys1.forEach(k => {
        if (excluded.indexOf(k) === -1) cnt1++;
      });
      keys2.forEach(k => {
        if (excluded.indexOf(k) === -1) cnt2++;
      });
      if (cnt1 !== cnt2) return false;
    }


    keys1.forEach(k => {
      if (excluded.indexOf(k) > -1) return;

      if (typeof obj1[k] !== typeof obj2[k]) {
        result = false;
        return false;
      }
      if (isFunction(obj1[k])) {
        if (obj1[k].toString() != obj2[k].toString()) {
          result = false;
          return false;
        }
      } else if (isDate(obj1[k])) {
        if ((new Date(obj1[k])).valueOf() !== (new Date(obj2[k])).valueOf()) {
          result = false;
          return false;
        }
      } else if (isObject(obj1[k]) || Array.isArray(obj1[k])) {
        if (obj1[k] === null || obj2[k] === null) {
          result &= (obj1[k] === obj2[k]);
          return !!result;
        }
        result &= equals(obj1[k], obj2[k], u);
        return !!result;
      } else if (!(u ?
          (obj1[k] === obj2[k]) :
          (obj1[k] == obj2[k]))) {
        result = false;
        return result;
      }
    });

    return !!result;
  }

  /**
   * If u need check what a class instance without create (without use constructor).
   *
   *  @example
   *  class Some {}
   *  class Some2 extends Some {}
   *  class Some3 extends Some2 {}
   *  instanceOf(Some3, Some)       // is true
   *
   * @param {Object|Function} clsOrObj
   * @param {Function} clsOrig
   * @returns {*}
   */
  function instanceOf(clsOrObj, clsOrig) {
    if (clsOrObj instanceof clsOrig) return true;
    if (clsOrObj.name === clsOrig.name) return true;
    if (Object.getPrototypeOf(clsOrObj).name) {
      if (Object.getPrototypeOf(clsOrObj).name === clsOrig.name) return true;
      return instanceOf(Object.getPrototypeOf(clsOrObj), clsOrig);
    } else if (isFunction(clsOrObj) && clsOrObj.prototype.__proto__) {
      if (clsOrObj.prototype.__proto__.constructor.name === clsOrig.name) return true;
      return instanceOf(clsOrObj.prototype.__proto__.constructor, clsOrig);
    }
    return false;
  }

  function parseNumber(v, defaultValue) {
    v = Number(
      (isEmpty(v, true) || Array.isArray(v) || typeof v === 'boolean' ||
        (isString(v) && v.trim().length === 0)) ?
      NaN :
      v);
    return isNaN(v) ? defaultValue : v;
  }


  g.escapeRe = escapeRe;
  g.isSafari = isSafari;

  g.isFunction = isFunction;
  g.isObject = isObject;
  g.isString = isString;
  g.isArray = isArray;
  g.isNumber = isNumber;
  g.isDate = isDate;
  g.isPrimitive = isPrimitive;

  g.parseNumber = parseNumber;
  g.instanceOf = instanceOf;
  g.apply = apply;
  g.applyIf = applyIf;
  g.equals = equals;
  g.isEmpty = isEmpty;

  g.debounce = debounce;
  g.throttle = throttle;

  // if (!g.define) g.define = define;
  g.getDefined = getDefined;

  if (window) {
    g.cookies = {
      get(name) {
        const matches = document.cookie.match(new RegExp(
          '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      },
      set(name, value, options) {
        options = options || {};

        let expires = options.expires;

        if (typeof expires === 'number' && expires) {
          const d = new Date();
          d.setTime(d.getTime() + expires * 1000);
          expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
          options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        let updatedCookie = name + '=' + value;

        for (let propName in options) {
          if (!options.hasOwnProperty(propName)) continue;
          updatedCookie += '; ' + propName;
          const propValue = options[propName];
          if (propValue !== true) {
            updatedCookie += '=' + propValue;
          }
        }

        document.cookie = updatedCookie;
      }
    };
  }
  //endregion


  //region String
  if (!String.leftPad) {
    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     * <pre><code>
     var s = String.leftPad('123', 5, '0');
     // s now contains the string: '00123'
     * </code></pre>
     * @param {String} val The original string
     * @param {Number} size The total length of the output string
     * @param {String} [ch] The character with which to pad the original string (defaults to empty string " ")
     * @return {String} The padded string
     * @static
     */
    String.leftPad = function(val, size, ch) {
      let result = String(val);
      if (!ch) {
        ch = " ";
      }
      while (result.length < size) {
        result = ch + result;
      }
      return result;
    };
  }
  if (!String.prototype.leftPad) {
    /**
     * {@see String#leftPad}
     * @param val
     * @param size
     * @param ch
     * @returns {*}
     */
    String.prototype.leftPad = function(val, size, ch) {
      let result = String(val);
      if (!ch) {
        ch = " ";
      }
      while (result.length < size) {
        result = ch + result;
      }
      return result;
    };
  }

  if (!String.escape) {
    /**
     * Escapes the passed string for ' and \
     * @param {String} string The string to escape
     * @return {String} The escaped string
     * @static
     */
    String.escape = function(string) {
      return string.replace(/(['\\])/g, "\\$1");
    };
  }
  if (!String.prototype.escape) {
    /**
     * {@see String#escape}
     * @returns {string}
     */
    String.prototype.escape = function() {
      return this.replace(/(['\\])/g, "\\$1");
    };
  }

  if (!String.prototype.toJSON) {
    /**
     * строковый JSON преобразует к Object.
     * @method toJSON
     * @member String
     */
    String.prototype.toJSON = function() {
      return JSON.parse(this.toString());
    };
  }

  if (!String.prototype.toCamelCase)
    /**
     * From _some_some String to _someSome or _SomeSome.
     * @param {Boolean} [f=true] first symbol to Upper case?
     * @returns {string}
     */
    String.prototype.toCamelCase = function(f) {
      f = f !== false;
      let result = (this.indexOf('_') === -1) ?
        this[0].toUpperCase() + this.substring(1) :
        this[0] === '_' ?
        '_' + this.substring(1).split('_').map(v => {
          return v[0].toUpperCase() + v.substring(1);
        }).join('') :
        this.split('_').map(v => {
          return v[0].toUpperCase() + v.substring(1);
        }).join('');

      !f && (result = result[0].toLowerCase() + result.substr(1));

      return result;
    };
  //endregion


  //region Array
  if (!Array.prototype.indexOfKey) {
    /**
     * find item by special key from special position
     * @param {String|Object[]} key If key isArray then has `[{key:'asdf',val:'qwe'},{key:'zx',val:'tr4'}]`
     * @param {*} [val]
     * @param {Number} [from]
     * @returns {Number}
     */
    Object.defineProperty(Array.prototype, 'indexOfKey', {
      enumerable: false,
      writable: false,
      value: function(key, val, from) {
        let len = this.length;
        if (arguments.length < 3) from = 0;
        from = (from < 0) ?
          Math.ceil(from) :
          Math.floor(from);
        if (from < 0) from += len;

        if (isArray(key)) {
          if (arguments.length !== 2) {
            let p = key.concat([]);
            if (!p[0].hasOwnProperty('key')) throw new Error(
              'Check argumets for indexOfKey. (need {key:"",val:""}.');
            from = (val < 0 || !isNumber(val)) ? 0 : val;

            for (; from < len; from++) {
              let rec = this[from],
                fd = 0;
              for (let i = 0; i < p.length; i++) {
                if (p[i].key in this[from]) {
                  if (rec[p[i].key] === p[i].val) fd++;
                  if (isNumber(this[from][p[i].key]) || isNumber(p[i].val)) {
                    if (parseInt(p[i].val) === parseInt(this[from][p[i].key])) return from;
                  }
                }
              }
              if (fd === p.length) return from;
            }
          } else {
            let p = key.concat([]);

            for (; from < len; from++) {
              let rec = this[from],
                fd = 0;
              for (let i = 0; i < p.length; i++) {
                if (p[i] in this[from]) {
                  if (rec[p[i]] === val) fd++;
                  if (isNumber(this[from][p[i]]) || isNumber(val)) {
                    if (parseInt(val) === parseInt(this[from][p[i]])) return from;
                  }
                }
              }
              if (fd === p.length) return from;
            }
          }
        } else {
          for (; from < len; from++) {
            try {
              if (key in this[from]) {
                if (this[from][key] === val) return from;
                if (isNumber(this[from][key]) || isNumber(val)) {
                  if (parseInt(val) === parseInt(this[from][key])) return from;
                }
              }
            } catch (e) {
              /**/ }
          }
        }
        return -1;
      }
    });
    /**
     * reverse find item by special key from special position
     * @param {String|Object[]} key If key isArray then has `[{key:'asdf',val:'qwe'},{key:'zx',val:'tr4'}]`
     * @param {*} [val]
     * @param {Number} [from]
     * @returns {Number}
     */
    Object.defineProperty(Array.prototype, 'lastIndexOfKey', {
      enumerable: false,
      writable: false,
      value: function(key, val, from) {
        let len = this.length;
        from = Number(arguments[2]) || len;
        from = (from < 0) ?
          Math.ceil(from) :
          Math.floor(from);
        if (from < 0) from += len;

        if (isArray(key)) {
          let p = key.concat([]);
          if (!p[0].hasOwnProperty('key')) throw new Error(
            'Check argumets for indexOfKey. (need {key:"",val:""}.');
          from = (val < 0 || !isNumber(val)) ? 0 : val;

          for (; from > 0; from--) {
            let rec = this[from],
              fd = 0;
            for (let i = 0; i < p.length; i++) {
              if (p[i].key in this[from]) {
                if (rec[p[i].key] === p[i].val) fd++;
                if (isNumber(this[from][p[i].key]) || isNumber(p[i].val)) {
                  if (parseInt(p[i].val) === parseInt(this[from][p[i].key])) return from;
                }
              }
            }
            if (fd === p.length) return from;
          }
        } else {
          for (; from > 0; from--) {
            try {
              if (key in this[from]) {
                if (this[from][key] === val) return from;
                if (isNumber(this[from][key]) || isNumber(val)) {
                  if (parseInt(val) === parseInt(this[from][key])) return from;
                }
              }
            } catch (e) {
              /**/ }
          }
        }
        return -1;
      }
    });
  }
  //endregion

  return g;
})
(global || window);
