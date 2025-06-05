const { useEffect, useRef } = React;

function VitalsChart({ title, data, unit }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map((_, index) => `${index * 5}s`),
          datasets: [{
            label: `${title} (${unit})`,
            data: data,
            borderColor: title === 'Heart Rate' ? '#EF4444' : title === 'SpO2' ? '#3B82F6' : title === 'Blood Pressure' ? '#8B5CF6' : '#10B981',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: title === 'SpO2' ? 80 : title === 'Temperature' ? 95 : title === 'Blood Pressure' ? 60 : 50,
              max: title === 'SpO2' ? 100 : title === 'Temperature' ? 106 : title === 'Blood Pressure' ? 160 : 120,
              title: { display: true, text: unit },
            },
            x: { title: { display: true, text: 'Time (seconds)' } },
          },
          plugins: {
            legend: { display: true, position: 'top' },
            tooltip: { enabled: true },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, title, unit]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex-1 min-w-[300px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title} Trend</h3>
      <div className="h-64">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}