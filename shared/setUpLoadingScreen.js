function setupLoadingScreen(onStart) {
  const dialog = document.querySelector('[data-element="loading-dialog"]');
  const startButton = dialog.querySelector('[data-element="start-button"]');

  if (!dialog || !startButton) {
    throw new Error("Loading manager: Required elements not found");
  }

  startButton.addEventListener("click", () => {
    dialog.close();
    onStart();
  });

  startButton.style.display = "block";
}
