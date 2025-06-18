const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function fetchWeatherData(query, units = "metric") {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch current weather data");
  }
  return await response.json();
}

export async function fetchForecastData(query, units = "metric") {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=${units}&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch forecast data");
  }
  return await response.json();
}
