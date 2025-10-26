import { getInterestingNumbers } from "./math.js";
import { isZonedDateTimeInBounds } from "./timeConsts.js";
import { getCheckedUnits } from "./unitSelector.js";
function createRow(dateRow) {
    const row = document.createElement("tr");
    const timeUnitDiv = document.createElement("td");
    const valueDiv = document.createElement("td");
    const labelDiv = document.createElement("td");
    const dateDiv = document.createElement("td");
    timeUnitDiv.textContent = dateRow.timeUnit;
    valueDiv.textContent = dateRow.value.toString();
    labelDiv.textContent = dateRow.description;
    dateDiv.textContent = dateRow.date.toString();
    row.append(timeUnitDiv, valueDiv, labelDiv, dateDiv);
    return row;
}
function getNextDates(d, units, 
//numbers: InterestingNumberType[],
maxDate) {
    const now = Temporal.Now.zonedDateTimeISO("utc");
    const duration = d.abs().round({ largestUnit: "seconds", relativeTo: now });
    const dates = [];
    units.forEach((unit) => {
        const now = Temporal.Now.zonedDateTimeISO("utc");
        const nextAge = Math.ceil(duration.seconds / unit.seconds);
        const interestingNumbers = getInterestingNumbers(nextAge);
        interestingNumbers.sort((a, b) => a.value - b.value);
        // .every() loop to break for large durations
        interestingNumbers.every((interestingNumber) => {
            const thisDuration = Temporal.Duration.from({
                seconds: Math.ceil(interestingNumber.value * unit.seconds - duration.seconds),
            });
            if (!isZonedDateTimeInBounds(thisDuration, now)) {
                return false;
            }
            const thisDate = now.add(thisDuration);
            if (Temporal.ZonedDateTime.compare(thisDate, maxDate) < 0) {
                dates.push({
                    value: interestingNumber.value,
                    date: thisDate,
                    description: interestingNumber.description,
                    timeUnit: unit.label,
                    index: interestingNumber.index,
                });
            }
            return true;
        });
    });
    return dates;
}
document
    .getElementById("getDatesButton")
    .addEventListener("click", submitDatesCalculation);
function submitDatesCalculation() {
    const table = document.getElementById("outputTable");
    table.classList.remove("hidden");
    const birthdateInput = document.getElementById("birthdateInput");
    const birthTimeInput = document.getElementById("birthTimeInput");
    const timeZoneSelect = document.getElementById("timeZones");
    const birthdateString = `${birthdateInput.value}T${birthTimeInput.value}Z[${timeZoneSelect.value}]`;
    const startDate = Temporal.ZonedDateTime.from(birthdateString);
    const now = Temporal.Now.instant();
    const duration = now.since(startDate.toInstant());
    const nowISO = now.toZonedDateTimeISO("utc");
    const maxDate = nowISO.add({ years: 10 });
    const units = getCheckedUnits();
    const dates = getNextDates(duration, units, maxDate);
    const output = document.getElementById("output");
    // clear any previous rows
    output.replaceChildren();
    dates.forEach((date) => {
        const row = createRow(date);
        output.append(row);
    });
}
