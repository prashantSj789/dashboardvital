const { useState, useEffect } = React;

function Dashboard() {
  // Current vitals for display
  const [vitals, setVitals] = useState({
    heartRate: { value: 0, unit: 'bpm', status: 'normal' },
    spo2: { value: 0, unit: '%', status: 'normal' },
    bloodPressure: { value: '0/0', unit: 'mmHg', status: 'normal' },
    temperature: { value: 0, unit: '°F', status: 'normal' },
    pulseRate: { value: 0, unit: 'bpm', status: 'normal' },
    respirationRate: { value: 0, unit: 'breaths/min', status: 'normal' },
  });

  // Historical data arrays for charts
  const [history, setHistory] = useState({
    heartRate: [],
    spo2: [],
    bloodPressureSys: [],
    temperature: [],
  });

  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    const ws = new WebSocket('wss://arogyasyncbe-cxbmdwh6dvhqd8er.canadacentral-01.azurewebsites.net/ws/1');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setConnectionStatus('Connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const systolic = Math.round(data.bloodPressureSys);
        const diastolic = Math.round(data.bloodPressureDia);
        const bloodPressureValue = `${systolic}/${diastolic}`;

        setVitals({
          heartRate: {
            value: data.heartRate,
            unit: 'bpm',
            status: data.heartRate > 100 || data.heartRate < 60 ? 'critical' : 'normal',
          },
          spo2: {
            value: data.spo2,
            unit: '%',
            status: data.spo2 < 95 ? 'critical' : 'normal',
          },
          bloodPressure: {
            value: bloodPressureValue,
            unit: 'mmHg',
            status: systolic > 140 || diastolic > 90 ? 'critical' : 'normal',
          },
          temperature: {
            value: data.temperature,
            unit: '°F',
            status: data.temperature > 100.4 ? 'critical' : 'normal',
          },
          pulseRate: {
            value: data.pulseRate,
            unit: 'bpm',
            status: data.pulseRate > 100 || data.pulseRate < 60 ? 'critical' : 'normal',
          },
          respirationRate: {
            value: data.respirationRate,
            unit: 'breaths/min',
            status: data.respirationRate > 20 || data.respirationRate < 12 ? 'critical' : 'normal',
          },
        });

        // Keep last 20 data points for each vital
        setHistory(prev => ({
          heartRate: [...prev.heartRate.slice(-19), data.heartRate],
          spo2: [...prev.spo2.slice(-19), data.spo2],
          bloodPressureSys: [...prev.bloodPressureSys.slice(-19), systolic],
          temperature: [...prev.temperature.slice(-19), data.temperature],
        }));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Failed to connect');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setConnectionStatus('Disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-600 p-8">
      <div className="flex justify-center items-center mb-8">
        <img src="logo.png" alt="ORALENS Logo" className="h-16" />
        <h1 className="text-4xl font-bold text-white ml-4 drop-shadow-lg">Patient Vitals Dashboard</h1>
      </div>
      <p className="text-center text-white mb-4">WebSocket Status: {connectionStatus}</p>

      {/* Vitals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VitalsCard title="Heart Rate" value={vitals.heartRate.value} unit={vitals.heartRate.unit} status={vitals.heartRate.status} />
        <VitalsCard title="SpO2" value={vitals.spo2.value} unit={vitals.spo2.unit} status={vitals.spo2.status} />
        <VitalsCard title="Blood Pressure" value={vitals.bloodPressure.value} unit={vitals.bloodPressure.unit} status={vitals.bloodPressure.status} />
        <VitalsCard title="Temperature" value={vitals.temperature.value} unit={vitals.temperature.unit} status={vitals.temperature.status} />
        <VitalsCard title="Pulse Rate" value={vitals.pulseRate.value} unit={vitals.pulseRate.unit} status={vitals.pulseRate.status} />
        <VitalsCard title="Respiration Rate" value={vitals.respirationRate.value} unit={vitals.respirationRate.unit} status={vitals.respirationRate.status} />
      </div>

      {/* Vitals Trends Charts */}
      <h2 className="text-2xl font-semibold text-white mt-10 mb-4 text-center">Vitals Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <VitalsChart title="Heart Rate" data={history.heartRate} unit="bpm" />
        <VitalsChart title="SpO2" data={history.spo2} unit="%" />
        <VitalsChart title="Blood Pressure" data={history.bloodPressureSys} unit="mmHg" />
        <VitalsChart title="Temperature" data={history.temperature} unit="°F" />
      </div>
    </div>
  );
}

// Export if needed
// export default Dashboard;

