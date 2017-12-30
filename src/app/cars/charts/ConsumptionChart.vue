<script>
import { Line } from 'vue-chartjs';
import { accentColor } from './colors';

export default {
  extends: Line,

  props: {
    refuels: { required: true },
  },

  data() {
    return {
      chartOptions: {
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
                min: Math.min(...this.refuels.filter(r => r.consumption).map(r => r.consumption)) * 90,
              },
            },
          ],
        },
      },

      chartData: {
        datasets: [
          {
            label: 'Consumption',
            data: this.refuels.filter(r => r.consumption).map(r => ({ t: r.date, y: r.consumption * 100 })),
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
