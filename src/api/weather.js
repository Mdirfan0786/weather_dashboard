const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchWeatherByCity(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
  );
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

export async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
  );
  if (!res.ok) throw new Error("Location weather failed");
  return res.json();
}
