import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ datasets }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: datasets[0]?.data.map((_, index) => index + 1) || [],
          datasets: datasets.map((dataset, index) => ({
            label: dataset.label || `Dataset ${index + 1}`,
            data: dataset.data,
            borderColor: dataset.borderColor || `rgba(75, 192, 192, 1)`,
            borderWidth: dataset.borderWidth || 1,
            fill: dataset.fill || false,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                beginAtZero: true,
              },
            },
          },
        },
      });
    }
  }, [datasets]);

  return <canvas ref={chartContainer} />;
};

export default LineChart;
