<script>
  export default {
    methods: {

      /**
       * Получение данных из объекта через квадратные скобки
       * @param {Object} obj объект модели
       * @param {String} desc описание пути к данным (например, 'user.birthday.year')
       */
      getDescendantProp(obj, desc) {
        let arr = desc.split('.');
        while (arr.length && (obj = obj[arr.shift()])) ;
        return obj;
      }

    }
  };
</script>
