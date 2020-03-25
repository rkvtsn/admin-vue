<script>
export default {
  props: {
    labelAsHTML: { type: Boolean, default: false },
    labelWidth: {
      type: String,
      default: ''
    },
    label: {
      type: [Number, String],
      default: () => null
    },
    textAfterLabel: {
      type: String,
      default: ':'
    },
    for: {
      type: [Number, String],
      default: () => null
    },
  },
  data() {
    return {
      textLabel: (this.label && this.textAfterLabel && this.label[this.label.length - 1] !== this.textAfterLabel)
        ? this.label + this.textAfterLabel
        : this.label,
      // labelId: (this.for) ? this.for : this.generateUniqueLabelId()
    };
  },
  computed: {
    labelId() {
      return (this.for) ? this.for : this.generateUniqueLabelId();
    }
  },
  methods: {
    generateUniqueLabelId() {
      let seed = (Date.now) ? Date.now() : Date().getTime();
      return Math.floor((1 + Math.random()) * 0x10000 * Math.round(seed / 1000))
        .toString(16)
        .substring(1);
    }
  }
};
</script>
