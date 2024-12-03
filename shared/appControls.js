function createAppControls(appName, resetCallback) {
  const existingControls = document.querySelector(".app-controls");
  if (existingControls) {
    existingControls.remove();
  }

  // Create container div
  const container = document.createElement("div");
  container.className = "app-controls";
  document.body.appendChild(container);

  // Create menu link
  const homeLink = document.createElement("a");
  homeLink.href = "/";
  homeLink.className = "btn app-controls__btn";
  homeLink.textContent = "Main Menu";

  // Create buttons
  const resetButton = createButton("New");
  const saveButton = createButton("Save");

  // Set classes
  resetButton.class("btn app-controls__btn");
  saveButton.class("btn app-controls__btn");

  // Add elements to container
  container.appendChild(homeLink);
  container.appendChild(resetButton.elt);
  container.appendChild(saveButton.elt);

  // Set click handlers
  resetButton.mousePressed(
    resetCallback || console.warn("No reset callback provided")
  );
  saveButton.mousePressed(() => {
    click.play();
    save(`${appName}${month()}${day()}${hour()}${second()}.jpg`);
  });

  return {
    homeLink,
    resetButton,
    saveButton,
    container,
  };
}
