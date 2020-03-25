<script>
import DescendantPropMixin from './DescendantPropMixin.vue';
export default {
  mixins: [DescendantPropMixin],
  props: {
    // текст в опции
    optionText: {
      type: [String, Function],
      default: () => { return (x) => x; }
    },
    // значение в опции
    optionValue: {
      type: [String, Function],
      default: () => { return (x) => x; }
    },
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Object, String, Number, Boolean],
      default: () => { }
    },
    validation: {
      type: Object,
      default: null
    }
  },
  data() {
    let selectedValue = this.value;
    return {
      selectedValue
    };
  },
  watch: {
    'value'(v) {
      this.selectedValue = v;
    }
  },
  methods: {
    /**
     * Метод для получения значения по описанию @desc из объекта @item
     * @param {*} item - элемент, в котором хранится значение
     * @param {String, Function} desc - описание, где в item храниться (String), или функция определяющая получение значения
     */
    fn(item, desc) {
      // Если desc - строка, то получаем значение из пропертей item'a
      if (typeof desc === 'string') {
        return this.getDescendantProp(item, desc);
      }
      // Если нет, то считаем, что desc - функция, и она возвращает нам значение item'a
      else {
        return desc(item);
      }
    },
    findIdByAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    },
    /**
     * Метод для эмита события 'input', передает значение, а также вызывает смену флага в валидаторе на touched
     */
    onInput(e) {
      if (this.validation) {
        this.validation.$touch();
      }
      this.$emit('input', e.target.value);
    }
  }
};
</script>

