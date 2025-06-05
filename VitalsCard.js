function VitalsCard({ title, value, unit, status }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex-1 min-w-[200px] transform hover:scale-105 transition-transform duration-200">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className={`text-3xl font-bold ${status === 'critical' ? 'text-red-600' : 'text-green-600'}`}>
        {value} <span className="text-lg font-normal">{unit}</span>
      </p>
      <p className="text-sm text-gray-500">Status: {status}</p>
    </div>
  );
}