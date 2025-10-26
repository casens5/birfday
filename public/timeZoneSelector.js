"use strict";
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
function populateUsersTimeZone() {
    const zone = Temporal.Now.timeZoneId();
    const userOption = document.getElementById("userTimeZone");
    userOption.textContent = zone;
    userOption.value = zone;
}
populateTimeZones();
