import { getInterestingNumbers } from "./math.js";
import { timeConsts } from "./timeConsts.js";
import { getTimeZone } from "./timeZoneSelector.js";
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
function getNextDates(duration, units, 
//numbers: InterestingNumberType[],
maxDate) {
    const dates = [];
    for (const time in units) {
        // overly complex implementation of % which handles floats as moduluses
        const secondsRemaining = Math.ceil((duration.seconds / timeConsts[time].seconds -
            Math.floor(duration.seconds / timeConsts[time].seconds)) *
            timeConsts[time].seconds);
        const nextDuration = Temporal.Duration.from({ seconds: secondsRemaining });
        const nextDate = Temporal.Now.zonedDateTimeISO("utc").add(nextDuration);
        const nextAge = Math.ceil(duration.seconds / timeConsts[time].seconds);
        const interestingNumbers = getInterestingNumbers(nextAge);
        interestingNumbers.sort((a, b) => a.value - b.value);
        dates.push({
            value: nextAge,
            date: nextDate,
            description: "next integer",
            timeUnit: units[time].label,
            index: nextAge,
        });
        interestingNumbers.forEach((interestingNumber) => {
            const thisDuration = Temporal.Duration.from({
                seconds: Math.round(interestingNumber.value * timeConsts[time].seconds - duration.seconds),
            });
            const thisDate = Temporal.Now.zonedDateTimeISO("utc").add(thisDuration);
            if (Temporal.ZonedDateTime.compare(thisDate, maxDate) < 0) {
                dates.push({
                    value: interestingNumber.value,
                    date: thisDate,
                    description: interestingNumber.description,
                    timeUnit: units[time].label,
                    index: interestingNumber.index,
                });
            }
        });
    }
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
    const timeZone = getTimeZone();
    const birthdateString = `${birthdateInput.value}T${birthTimeInput.value}Z[${timeZone}]`;
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
