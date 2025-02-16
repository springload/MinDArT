/**
 * Enables/disables app links based on the current week number since program start.
 * Used to progressively unlock content over time
 */
export function showOnlyCurrentLinks() {
  // set programme start date (mm/dd/yyyy)
  const startDate = new Date("01/01/2024");
  const dayInMilliseconds = 86400000;

  const today = new Date();
  const elapsedDays = Math.floor((today - startDate) / dayInMilliseconds);
  const currentWeekNumber = Math.ceil(elapsedDays / 7);

  const homeGrid = document.querySelector('[data-element="home-grid"]');
  if (!homeGrid) {
    console.warn(
      'Parent element with attribute data-element="home-grid" not found'
    );
  }
  const drawingAppLinks = homeGrid.querySelectorAll("[data-week]");

  // Enable/disable links based on their week number
  // Links for future weeks are made unclickable using the 'disabled' attribute
  drawingAppLinks.forEach((link) => {
    link.dataset.week <= currentWeekNumber
      ? link.removeAttribute("disabled")
      : link.setAttribute("disabled", true);
  });
}

// Interface utility functions for managing button states and interactions

// Remove 'active' class from all buttons
export function clearActiveButtonState() {
  const activeButtons = document.querySelectorAll(".btn.active");
  activeButtons.forEach((button) => button.classList.remove("active"));
}

export function hasActiveClass(el) {
  return Boolean(el && el.classList.contains("active"));
}
