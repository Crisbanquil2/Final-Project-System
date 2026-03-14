const OPEN_WEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherForCity(city) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('Weather API key is missing. Add VITE_WEATHER_API_KEY to your .env file.');
  }

  const params = new URLSearchParams({
    q: city,
    units: 'metric',
    appid: apiKey,
  });

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${OPEN_WEATHER_BASE}/weather?${params.toString()}`),
    fetch(`${OPEN_WEATHER_BASE}/forecast?${params.toString()}`),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    let details = '';
    try {
      const body = await currentRes.json();
      if (body?.message) {
        details = ` (${body.message})`;
      }
    } catch {}

    if (currentRes.status === 429 || forecastRes.status === 429) {
      throw new Error('Weather service is temporarily rate limited. Please try again later.');
    }

    if (currentRes.status === 401) {
      throw new Error(
        `Your OpenWeather API key is not active or invalid yet. It can take up to 2 hours after account creation before it works. Details:${details}`,
      );
    }

    throw new Error(
      `Unable to load weather data right now. HTTP ${currentRes.status || ''}${details}`,
    );
  }

  const currentJson = await currentRes.json();
  const forecastJson = await forecastRes.json();

  const byDate = {};
  for (const entry of forecastJson.list || []) {
    const date = entry.dt_txt?.split(' ')[0];
    if (!date) continue;
    const hour = entry.dt_txt.split(' ')[1];
    const key = date;
    if (!byDate[key] || hour === '12:00:00') {
      byDate[key] = entry;
    }
  }

  const days = Object.values(byDate)
    .slice(0, 5)
    .map((entry) => ({
      date: entry.dt_txt.split(' ')[0],
      temp: Math.round(entry.main.temp),
      icon: entry.weather?.[0]?.icon,
      description: entry.weather?.[0]?.description,
    }));

  const current = {
    city: `${currentJson.name}, ${currentJson.sys?.country ?? ''}`.trim(),
    temp: Math.round(currentJson.main?.temp),
    feelsLike: Math.round(currentJson.main?.feels_like),
    humidity: currentJson.main?.humidity,
    wind: currentJson.wind?.speed,
    icon: currentJson.weather?.[0]?.icon,
    description: currentJson.weather?.[0]?.description,
  };

  return { current, forecast: days };
}

