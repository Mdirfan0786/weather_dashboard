export function showError(output, msg) {
  output.classList.add("error");
  output.innerHTML = `
    <p class="error-msg">
      <i class="fa-solid fa-triangle-exclamation"></i>
      ${msg}
    </p>
  `;
}
