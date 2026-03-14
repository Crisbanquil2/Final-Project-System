export default function ForecastDisplay({ days }) {
  if (!days || days.length === 0) return null;

  return (
    <div className="weather-forecast">
      {days.map((day) => (
        <div key={day.date} className="weather-forecast-item">
          <p className="forecast-date">
            {new Date(day.date).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          {day.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description || 'Weather'}
            />
          )}
          <p className="forecast-temp">{day.temp}°C</p>
        </div>
      ))}
    </div>
  );
}

