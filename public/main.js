import { getInterestingValues } from "./math.js";
import { timeConsts } from "./timeConsts.js";
import { getTimeZone } from "./timeZoneSelector.js";
import { getCheckedUnits } from "./unitSelector.js";
function createRow(type, interestingValues) {
    const row = document.createElement("tr");
    const numberType = document.createElement("th");
    numberType.textContent = type;
    numberType.rowSpan = interestingValues.length;
    row.append(numberType);
    const output = document.getElementById("output");
    output.append(row);
    interestingValues.forEach((value, index) => {
        const valueDiv = document.createElement("td");
        const labelDiv = document.createElement("td");
        const dateDiv = document.createElement("td");
        if (index === 0) {
            row.append(valueDiv, labelDiv, dateDiv);
        }
        else {
            const subRow = document.createElement("tr");
            subRow.append(valueDiv, labelDiv, dateDiv);
            output.append(subRow);
        }
        valueDiv.textContent = value.value.toLocaleString();
        labelDiv.textContent = value.description.toString();
        dateDiv.textContent = value.date.toString();
    });
}
function getNextDates(duration, units, numbers, maxDate) {
    const dates = [];
    for (const time in units) {
        const age = duration / timeConsts[time].seconds;
        const nextAge = Math.ceil(age);
        const timeDelta = Math.round((nextAge - age) * timeConsts[time].seconds);
        const nextDuration = Temporal.Duration.from({ seconds: timeDelta });
        const nextDate = Temporal.Now.instant().add(nextDuration);
        const interestingValues = getInterestingValues(nextAge);
        interestingValues.sort((a, b) => a.value - b.value);
        const vals = [nextAge];
        const filteredVals = interestingValues.filter((interesting) => {
            if (vals.includes(interesting.value)) {
                return false;
            }
            else {
                vals.push(interesting.value);
                return true;
            }
        });
        dates.push({
            value: nextAge,
            date: nextDate,
            description: "next integer",
        });
        filteredVals.forEach((interestingValue) => {
            const thisDuration = Temporal.Duration.from({
                seconds: Math.round((interestingValue.value - age) * timeConsts[time].seconds),
            });
            const thisDate = Temporal.Now.instant().add(thisDuration);
            if (thisDate < maxDate) {
                dates.push({
                    value: interestingValue.value,
                    date: thisDate,
                    description: interestingValue.description,
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
    const dates = getNextDates(duration.seconds, units, [], maxDate);
    console.log("wowo", startDate, now, duration, units, maxDate, dates);
    const output = document.getElementById("output");
    // clear any previous rows
    output.replaceChildren();
    //dates.forEach((date) => {
    //  createRow(units[time].label, dates[time]);
    //});
}
