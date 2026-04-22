const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const output = document.getElementById("output");

const API_KEY = import.meta.env.VITE_API_KEY;

// Get history
function getHistory() {
  return JSON.parse(localStorage.getItem("weatherHistory")) || [];
}

// Save history
function saveToHistory(city) {
  let history = getHistory();

  // remove duplicates
  history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());

  history.unshift(city);

  history = history.slice(0, 5);

  localStorage.setItem("weatherHistory", JSON.stringify(history));
}

// Render history
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
    const city = e.target.dataset.city;
    searchCity(city);
  }
});

// reuse search
function searchCity(city) {
  cityInput.value = city;
  form.dispatchEvent(new Event("submit"));
}

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    output.classList.add("error");
    output.textContent = "Please enter a city name.";
    return;
  }

  // reset state
  output.classList.remove("error");
  output.innerHTML = `
    <div class="loader">
      <div class="spinner"></div>
      <p>Fetching weather...</p>
    </div>
  `;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    );

    if (!res.ok) {
      throw new Error("City not found");
    }

    const data = await res.json();

    // save & render history
    saveToHistory(city);
    renderHistory();

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
  } catch (err) {
    output.classList.add("error");

    output.innerHTML = `
      <p class="error-msg">
        <i class="fa-solid fa-triangle-exclamation"></i>
        ${err.message}
      </p>
    `;
  }
});

renderHistory();
