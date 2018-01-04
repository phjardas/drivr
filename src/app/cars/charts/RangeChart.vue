<script>
import { Bar, mixins } from 'vue-chartjs';
const { reactiveData } = mixins

export default {
  extends: Bar,
  mixins: [reactiveData],

  props: {
    refuels: { required: true },
    bucketSize: { type: Number, default: 25 },
  },

  data() {
    return {
      options: {
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },

  watch: {
    bucketSize(newValue) {
      this.updateChartData();
    }
  },

  methods: {
    updateChartData() {
      const { primaryDark: backgroundColor } = this.$vuetify.theme;
      const histogram = this.calculateHistogram();

      this.chartData = {
        labels: histogram.labels,
        datasets: [
          {
            label: 'Range Histogram',
            data: histogram.data,
            backgroundColor,
          },
        ],
      };
    },
    calculateHistogram() {
      const createBucket = distance => `x${Math.round(distance / this.bucketSize) * this.bucketSize}`;

      const histogram = this.refuels
        .filter(refuel => refuel.distance)
        .map(refuel => ({ distance: createBucket(refuel.distance), count: 1 }))
        .reduce((a, b) => {
          a[b.distance] = (a[b.distance] || 0) + b.count;
          return a;
        }, {});

      const buckets = Object.keys(histogram)
        .map(k => parseInt(k.substring(1)))
        .sort();
      const min = buckets[0];
      const max = buckets[buckets.length - 1];
      const labels = [];
      const data = [];

      for (let i = min; i <= max; i += this.bucketSize) {
        labels.push(i);
        data.push(histogram[`x${i}`] || 0);
      }

      return { labels, data };
    },
  },

  mounted() {
    this.updateChartData();
    this.renderChart(this.chartData, this.options);
  },
};
</script>
