<script>
import { Bar } from 'vue-chartjs';
import { accentColor } from './colors';

function createRangeHistogram(refuels) {
  const bucketSize = 10;
  const createBucket = distance => `x${Math.round(distance / bucketSize) * bucketSize}`;

  const histogram = refuels
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

  for (let i = min; i <= max; i += bucketSize) {
    labels.push(i);
    data.push(histogram[`x${i}`] || 0);
  }

  return { labels, data };
}

export default {
  extends: Bar,

  props: {
    refuels: { required: true },
  },

  data() {
    const histogram = createRangeHistogram(this.refuels);

    return {
      chartOptions: {
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              //stepSize: 10,
            },
          ],
        },
      },

      chartData: {
        labels: histogram.labels,
        datasets: [
          {
            label: 'Range Histogram',
            data: histogram.data,
            backgroundColor: accentColor,
          },
        ],
      },
    };
  },

  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  },
};
</script>
