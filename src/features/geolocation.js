import { fetchWeatherByCoords } from "../api/weather";
import { renderWeather } from "../ui/render";
import { showLoader } from "../utils/loader";
import { showError } from "../utils/error";
import { saveToHistory, renderHistory } from "./history";

export function initGeolocation(button, output) {
  button.addEventListener("click", () => {
    if (!navigator.geolocation) {
      return showError(output, "Geolocation not supported");
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        showLoader(output, "Fetching your location weather...");
        try {
          const data = await fetchWeatherByCoords(latitude, longitude);
          saveToHistory(data.name);
          renderHistory();
          renderWeather(output, data);
        } catch (err) {
          showError(output, err.message);
        }
      },
      () => showError(output, "Location access denied"),
    );
  });
}
