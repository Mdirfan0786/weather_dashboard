const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const output = document.getElementById("output");
const locationBtn = document.getElementById("current-location");

const API_KEY = import.meta.env.VITE_API_KEY;

// Loader
function showLoader(text = "Fetching weather...") {
  output.classList.remove("error");
  output.innerHTML = `
    <div class="loader">
      <div class="spinner"></div>
      <p>${text}</p>
    </div>
  `;
}

// Render Weather UI
function renderWeather(data) {
  const iconCode = data.weather[0].icon;
  const isDay = iconCode.includes("d");

  output.innerHTML = `
    <div class="weather-card">
      <div class="top">
        <div>
          <h2>${data.name}</h2>
          <span class="badge">${data.sys.country}</span>
        </div>

        <div class="icon">
          ${
            isDay
              ? '<i class="fa-regular fa-sun"></i>'
              : '<i class="fa-solid fa-moon"></i>'
          }
        </div>
      </div>

      <h1 class="temp">${data.main.temp}<span>°C</span></h1>
      <p class="condition">${data.weather[0].description}</p>

      <div class="grid">
        <div class="box">
          <p>FEELS LIKE</p>
          <h3>${data.main.feels_like}°C</h3>
        </div>

        <div class="box">
          <p>HUMIDITY</p>
          <h3>${data.main.humidity}%</h3>
        </div>

        <div class="box">
          <p>WIND</p>
          <h3>${data.wind.speed} m/s</h3>
        </div>

        <div class="box">
          <p>PRESSURE</p>
          <h3>${data.main.pressure} hPa</h3>
        </div>
      </div>
    </div>
  `;
}

// Geolocation
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocationWeather, geoError);
  } else {
    showError("Geolocation not supported");
  }
});

async function getLocationWeather(position) {
  console.log(position);
  const { latitude, longitude } = position.coords;

  showLoader("Fetching your location weather...");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
    );

    if (!res.ok) throw new Error("Location weather failed");

    const data = await res.json();

    saveToHistory(data.name);
    renderHistory();

    renderWeather(data);
  } catch (err) {
    showError(err.message);
  }
}

function geoError() {
  showError("Location access denied");
}

// Error UI
function showError(msg) {
  output.classList.add("error");
  output.innerHTML = `
    <p class="error-msg">
      <i class="fa-solid fa-triangle-exclamation"></i>
      ${msg}
    </p>
  `;
}

// History
function getHistory() {
  return JSON.parse(localStorage.getItem("weatherHistory")) || [];
}

function saveToHistory(city) {
  let history = getHistory();

  history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  history = history.slice(0, 5);

  localStorage.setItem("weatherHistory", JSON.stringify(history));
}

function renderHistory() {
  const historyDiv = document.getElementById("history");
  const history = getHistory();

  historyDiv.innerHTML = history
    .map(
      (city) =>
        `<button class="history-btn" data-city="${city}">${city}</button>`,
    )
    .join("");
}

// Event delegation
document.getElementById("history").addEventListener("click", (e) => {
  if (e.target.matches(".history-btn")) {
    searchCity(e.target.dataset.city);
  }
});

// Reuse search
function searchCity(city) {
  cityInput.value = city;
  form.dispatchEvent(new Event("submit"));
}

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return showError("Please enter a city name");

  showLoader();

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    saveToHistory(city);
    renderHistory();

    renderWeather(data);
  } catch (err) {
    showError(err.message);
  }
});

// Load history on page load
renderHistory();
