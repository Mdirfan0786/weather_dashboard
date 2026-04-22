export function renderWeather(output, data) {
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
        <div class="box"><p>FEELS LIKE</p><h3>${data.main.feels_like}°C</h3></div>
        <div class="box"><p>HUMIDITY</p><h3>${data.main.humidity}%</h3></div>
        <div class="box"><p>WIND</p><h3>${data.wind.speed} m/s</h3></div>
        <div class="box"><p>PRESSURE</p><h3>${data.main.pressure} hPa</h3></div>
      </div>
    </div>
  `;
}
