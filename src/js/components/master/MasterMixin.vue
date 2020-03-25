<script>
export default {
  data() {
    return {
      isReady: false,
      stepNumber: 1,
      isNew: true
    };
  },
  methods: {
    goStep(step) {
      // налюбой, если назад || альтернатива далее (+1) || на любой, если завершена
      if (step < this.stepNumber || ((step - 1) == this.stepNumber && this.isReady) || !this.isNew) {
        this.setStep(step);
      }
    },
    // установка шага
    setStep(step) {
      this.stepNumber = step;
    },
    // установка флага для "Далее"
    setReady(value) {
      this.isReady = value;
    },
    // установка флага для "Изменено"
    changed(v) {
      this.isReady = !!v; // || false
    }
  },
  computed: {
    // получение текущего состояния в виде текста
    step() {
      return `step-${this.stepNumber}`;
    }
  }
};
</script>
