import { fetchWeatherByCity } from "./api/weather";
import { renderWeather } from "./ui/render";
import { showLoader } from "./utils/loader";
import { showError } from "./utils/error";
import { saveToHistory, renderHistory } from "./features/history";
import { initGeolocation } from "./features/geolocation";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const output = document.getElementById("output");
const locationBtn = document.getElementById("current-location");

// Geolocation init
initGeolocation(locationBtn, output);

// History clicks
document.getElementById("history").addEventListener("click", (e) => {
  if (e.target.matches(".history-btn")) {
    cityInput.value = e.target.dataset.city;
    form.dispatchEvent(new Event("submit"));
  }
});

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return showError(output, "Please enter a city name");

  showLoader(output);

  try {
    const data = await fetchWeatherByCity(city);
    saveToHistory(city);
    renderHistory();
    renderWeather(output, data);
  } catch (err) {
    showError(output, err.message);
  }
});

// Initial history
renderHistory();
