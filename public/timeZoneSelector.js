"use strict";
function populateUsersTimeZone() {
    const zone = Temporal.Now.timeZoneId();
    const userOption = document.getElementById("userTimeZone");
    userOption.textContent = zone;
    userOption.value = zone;
}
function populateTimeZones() {
    populateUsersTimeZone();
    const userTimeZone = Temporal.Now.timeZoneId();
    const existingZones = [userTimeZone, "UTC"];
    const zones = Intl.supportedValuesOf("timeZone");
    const selector = document.getElementById("timeZones");
    zones.forEach((zone) => {
        const option = document.createElement("option");
        option.textContent = zone;
        option.value = zone;
        if (!existingZones.includes(zone)) {
            selector.append(option);
        }
    });
}
document
    .getElementById("showTimeCheckbox")
    .addEventListener("change", toggleTimes);
function toggleTimes() {
    const checkbox = document.getElementById("showTimeCheckbox");
    const timeInputs = document.getElementsByClassName("timeInput");
    const toggleState = checkbox.checked;
    Array.from(timeInputs).forEach((element) => {
        if (toggleState) {
            element.classList.remove("hidden");
        }
        else {
            element.classList.add("hidden");
        }
    });
}
populateTimeZones();
