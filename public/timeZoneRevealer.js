"use strict";
document
    .getElementById("timeZones")
    .addEventListener("change", revealExtendedTimeZones);
function revealExtendedTimeZones() {
    const timeZones = document.getElementById("timeZones");
    const inputLabel = document.getElementById("timeZonesExtendedLabel");
    inputLabel.classList.remove("hidden");
    if (timeZones.value !== "(other)") {
        inputLabel.classList.add("hidden");
    }
}
