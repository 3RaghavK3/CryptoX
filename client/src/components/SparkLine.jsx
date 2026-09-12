import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export function SparkLine({ prices, color }) {
  const data = {
    labels: prices.map((prices, index) => index),
    datasets: [
      {
        data: prices,
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line data={data} options={options} />
    </div>
  );
}
