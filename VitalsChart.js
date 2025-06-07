function VitalsChart({ title, data, unit, labels }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);
React.useEffect(() => {
  const ctx = canvasRef.current.getContext('2d');

  // Use labels as-is, they are strings already
  const formattedLabels = labels;

  if (!chartRef.current) {
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formattedLabels,
        datasets: [{
          label: `${title} (${unit})`,
          data,
          borderColor:
            title === 'Heart Rate' ? '#EF4444' :
            title === 'SpO2' ? '#3B82F6' :
            title === 'Blood Pressure' ? '#8B5CF6' :
            '#10B981',
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
        animation: { duration: 0 },
        scales: {
          y: {
            beginAtZero: false,
            min: title === 'SpO2' ? 80 : title === 'Temperature' ? 95 : title === 'Blood Pressure' ? 60 : 50,
            max: title === 'SpO2' ? 100 : title === 'Temperature' ? 106 : title === 'Blood Pressure' ? 160 : 120,
            title: { display: true, text: unit },
          },
          x: {
            title: { display: true, text: 'Time' },
            ticks: { maxRotation: 45, minRotation: 45 },
          },
        },
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: { enabled: true },
        },
      },
    });
  } else {
    const chart = chartRef.current;
    chart.data.labels = formattedLabels;
    chart.data.datasets[0].data = data;
    chart.update('none');
  }

  return () => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };
}, [data, labels, title, unit]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex-1 min-w-[300px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title} Trend</h3>
      <div className="h-64">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
