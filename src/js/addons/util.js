import moment from 'moment';

export default {
  install: function install(Vue) {
    /**
     * Функция поиска по массиву объектов
     * @param {Array} array массив объектов
     * @param {String} attr атрибут по каторому ищем
     * @param {*} value значение по которому ищем
     */
    const findBy = function(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    };
    /**
     * Функция получения элемента в массиве объектов
     * @param {Array} array массив объектов
     * @param {String} attr атрибут по каторому ищем
     * @param {*} value значение по которому ищем
     */
    const getBy = function(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return array[i];
        }
      }
      return null;
    };

    /**
     * Функция удаления из массива объектов
     * Сахар для findBy
     * @param {Array} array массив из которого удаляем
     * @param {String} attr атрибут по которму ищем
     * @param {*} key значение по которому ищем
     */
    const deleteBy = function(array, attr, value) {
      let i = findBy (array, attr, value);
      if (i > -1) {
        array.splice (i, 1);
      }
    };

    const findLambda = function(array, lambda) {
      for (var i = 0; i < array.length; i += 1) {
        if (lambda (array, i)) {
          return i;
        }
      }
      return -1;
    };

    const getDescendantProp = function(obj, desc) {
      let arr = desc.split ('.');
      while (arr.length && (obj = obj[arr.shift ()]));
      return obj;
    };

    const setDescendantProp = function(obj, desc, value) {
      var arr = desc.split ('.');
      var last = arr.pop ();
      while (arr.length && (obj = obj[arr.shift ()]));
      obj[last] = value;
    };

    Vue.$util = Vue.prototype.$util = {};

    Vue.$util.dateFormat = Vue.prototype.$util.dateFormat = (
      timestamp,
      format = 'd.m.Y'
    ) => {
      if (timestamp) return new Date (timestamp).format (format);
      return '';
    };


    Vue.filter('dateFormat', Vue.$util.dateFormat);

    Vue.$util.deleteBy = Vue.prototype.$util.deleteBy = deleteBy;
    Vue.$util.getBy = Vue.prototype.$util.getBy = getBy;
    Vue.$util.findBy = Vue.prototype.$util.findBy = findBy;
    Vue.$util.findLambda = Vue.prototype.$util.findLambda = findLambda;
    Vue.$util.getDescendantProp = Vue.prototype.$util.getDescendantProp = getDescendantProp;
    Vue.$util.setDescendantProp = Vue.prototype.$util.setDescendantProp = setDescendantProp;

    Vue.$range = Vue.$util.range = Vue.prototype.$util.range = (
      start,
      stop,
      step = 1
    ) =>
      Array (Math.ceil ((stop - start) / step))
        .fill (start)
        .map ((x, y) => x + y * step);

    Vue.$datetimeToStr = Vue.$util.datetimeToStr = Vue.prototype.$util.datetimeToStr = (
      timestamp,
      format = 'DD.MM.YYYY'
    ) => {
      return timestamp
        ? moment (Number (timestamp)).utc ().format (format)
        : '';
    };

    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;

        // 1. Положим O равным результату вызова ToObject с передачей ему
        //    значения this в качестве аргумента.
        if (this == null) {
          throw new TypeError ('"this" is null or not defined');
        }

        var O = Object (this);

        // 2. Положим lenValue равным результату вызова внутреннего метода Get
        //    объекта O с аргументом "length".
        // 3. Положим len равным ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. Если len равен 0, вернём -1.
        if (len === 0) {
          return -1;
        }

        // 5. Если был передан аргумент fromIndex, положим n равным
        //    ToInteger(fromIndex); иначе положим n равным 0.
        var n = +fromIndex || 0;

        if (Math.abs (n) === Infinity) {
          n = 0;
        }

        // 6. Если n >= len, вернём -1.
        if (n >= len) {
          return -1;
        }

        // 7. Если n >= 0, положим k равным n.
        // 8. Иначе, n<0, положим k равным len - abs(n).
        //    Если k меньше нуля 0, положим k равным 0.
        k = Math.max (n >= 0 ? n : len - Math.abs (n), 0);

        // 9. Пока k < len, будем повторять
        while (k < len) {
          // a. Положим Pk равным ToString(k).
          //   Это неявное преобразование для левостороннего операнда в операторе in
          // b. Положим kPresent равным результату вызова внутреннего метода
          //    HasProperty объекта O с аргументом Pk.
          //   Этот шаг может быть объединён с шагом c
          // c. Если kPresent равен true, выполним
          //    i.  Положим elementK равным результату вызова внутреннего метода Get
          //        объекта O с аргументом ToString(k).
          //   ii.  Положим same равным результату применения
          //        Алгоритма строгого сравнения на равенство между
          //        searchElement и elementK.
          //  iii.  Если same равен true, вернём k.
          if (k in O && O[k] === searchElement) {
            return k;
          }
          k++;
        }
        return -1;
      };
    }
  },
};
