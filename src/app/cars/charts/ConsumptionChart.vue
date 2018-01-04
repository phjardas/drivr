<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveData } = mixins

function exponentialDecay(values, attenuation) {
  const ret = [];
  let buffer;

  for (let value of values) {
    buffer = buffer ? buffer * (1 - attenuation) + value.y * attenuation : value.y;
    ret.push({ ...value, y: buffer });
  }

  return ret;
}

export default {
  extends: Line,
  mixins: [reactiveData],

  props: {
    refuels: { required: true },
    attenuation: { type: Number, default: 0.1 },
  },

  watch: {
    attenuation(newValue) {
      this.updateChartData();
    }
  },

  data() {
    const values = this.refuels.filter(r => r.consumption).map(r => r.consumption * 100);

    return {
      options: {
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'month',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: Math.min(...values) * 0.95,
                max: Math.max(...values) * 1.05,
              },
            },
          ],
        },
      },
    };
  },

  methods: {
    updateChartData() {
      const { primaryLight: backgroundColor } = this.$vuetify.theme;

      this.chartData = {
        datasets: [
          {
            label: 'Consumption',
            data: this.calculateChartData(),
            backgroundColor,
            pointRadius: 0,
          },
        ],
      };
    },
    calculateChartData() {
      return exponentialDecay(
        this.refuels.filter(r => r.consumption)
          .map(r => ({ t: r.date, y: r.consumption * 100 })),
          this.attenuation);
    },
  },

  mounted() {
    this.updateChartData();
    this.renderChart(this.chartData, this.options);
  },
};
</script>
