import {Bar, mixins} from 'vue-chartjs';

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      defaultOptions: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: true,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  mounted() {
    this.renderChart (
      this.chartData,
      Object.assign (this.defaultOptions, this.options)
    );
  },
  methods: {
    getURI() {
      return this.$refs.canvas.toDataURL ('image/png');
    },
  },
};
