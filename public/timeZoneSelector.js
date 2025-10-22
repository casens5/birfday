"use strict";
function populateExtendedTimeZones() {
    const zones = Intl.supportedValuesOf("timeZone");
    const selector = document.getElementById("timeZonesExtended");
    zones.forEach((zone) => {
        const option = document.createElement("option");
        option.textContent = zone;
        option.value = zone;
        selector.append(option);
    });
}
function populateUsersTimeZone() {
    const zone = Temporal.Now.timeZoneId();
    const userOption = document.getElementById("userTimeZone");
    userOption.textContent = zone;
    userOption.value = zone;
}
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
populateExtendedTimeZones();
populateUsersTimeZone();
