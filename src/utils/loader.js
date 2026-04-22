export function showLoader(output, text = "Fetching weather...") {
  output.classList.remove("error");
  output.innerHTML = `
    <div class="loader">
      <div class="spinner"></div>
      <p>${text}</p>
    </div>
  `;
}
