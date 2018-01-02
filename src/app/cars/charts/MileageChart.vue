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
                min: Math.min(...this.refuels.map(r => r.mileage)) * 0.99,
              },
            },
          ],
        },
      },

      chartData: {
        datasets: [
          {
            label: 'Mileage',
            data: this.refuels.map(r => ({ t: r.date, y: r.mileage })),
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
