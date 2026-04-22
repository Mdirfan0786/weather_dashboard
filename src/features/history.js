export function getHistory() {
  return JSON.parse(localStorage.getItem("weatherHistory")) || [];
}

export function saveToHistory(city) {
  let history = getHistory();
  history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  history = history.slice(0, 5);
  localStorage.setItem("weatherHistory", JSON.stringify(history));
}

export function renderHistory() {
  const historyDiv = document.getElementById("history");
  const history = getHistory();

  historyDiv.innerHTML = history
    .map(
      (city) =>
        `<button class="history-btn" data-city="${city}">${city}</button>`,
    )
    .join("");
}
