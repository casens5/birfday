document
  .getElementById("timeZones")!
  .addEventListener("change", revealExtendedTimeZones);

function revealExtendedTimeZones() {
  const timeZones = document.getElementById("timeZones") as HTMLSelectElement;
  const inputLabel = document.getElementById("timeZonesExtendedLabel")!;
  inputLabel.classList.remove("hidden");
  if (timeZones.value !== "(other)") {
    inputLabel.classList.add("hidden");
  }
}
