import { useEffect, useState } from 'react';
import { fetchWeatherForCity } from '../../services/weatherApi';
import ForecastDisplay from './ForecastDisplay';

export default function WeatherWidget() {
  const [city, setCity] = useState('Manila');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { current: c, forecast: f } = await fetchWeatherForCity(city);
        if (!mounted) return;
        setCurrent(c);
        setForecast(f);
      } catch (err) {
        if (!mounted) return;
        const message = err.message || 'Unable to load weather data.';
        setError(message);
        if (message.toLowerCase().includes('api key')) {
          setCurrent({
            city: 'Sample City, PH',
            temp: 29,
            feelsLike: 31,
            humidity: 65,
            wind: 3.5,
            icon: '04d',
            description: 'mostly cloudy (sample)',
          });
          setForecast([
            { date: '2026-03-13', temp: 29, icon: '04d', description: 'cloudy (sample)' },
            { date: '2026-03-14', temp: 30, icon: '01d', description: 'sunny (sample)' },
            { date: '2026-03-15', temp: 28, icon: '10d', description: 'rain showers (sample)' },
            { date: '2026-03-16', temp: 29, icon: '02d', description: 'partly cloudy (sample)' },
            { date: '2026-03-17', temp: 30, icon: '03d', description: 'clouds (sample)' },
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [city]);

  return (
    <div className="chart-card weather-card">
      <h3>Weather Overview</h3>
      <div className="weather-search-row">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city (e.g., Manila)"
          className="weather-input"
        />
      </div>
      {loading && <p className="page-status">Loading weather...</p>}
      {error && !loading && <p className="page-status page-status-error">{error}</p>}
      {current && !loading && (
        <div className="weather-content">
          <div className="weather-current">
            <div className="weather-main">
              {current.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
                  alt={current.description || 'Weather icon'}
                />
              )}
              <div>
                <p className="weather-temp">
                  {current.temp}
                  <span>°C</span>
                </p>
                <p className="weather-city">{current.city}</p>
                <p className="weather-description">{current.description}</p>
              </div>
            </div>
            <div className="weather-extra">
              <p>
                <span>Feels like:</span> {current.feelsLike}°C
              </p>
              <p>
                <span>Humidity:</span> {current.humidity}%
              </p>
              <p>
                <span>Wind:</span> {current.wind} m/s
              </p>
            </div>
          </div>
          <ForecastDisplay days={forecast} />
        </div>
      )}
    </div>
  );
}

