import { capitalize } from "./utils.js";
import { timeConsts } from "./timeConsts.js";
import { sequences, getNextBase10, getNextRepDigit, getNextXToPower, getNextSquareToDimension, getNextLucas, getNextFibonacci, getNextTriangle, getNextSquareTriangle, } from "./math.js";
const initInterestingNums = [
    getNextBase10,
    getNextRepDigit,
    [getNextXToPower, 2],
    [getNextXToPower, 3],
    [getNextXToPower, 4],
    [getNextXToPower, 5],
    [getNextXToPower, 6],
    [getNextXToPower, 7],
    [getNextXToPower, 8],
    [getNextXToPower, 9],
    [getNextXToPower, 10],
    [getNextXToPower, 11],
    [getNextXToPower, 12],
    [getNextXToPower, 13],
    [getNextXToPower, 14],
    [getNextXToPower, 15],
    [getNextXToPower, 16],
    [getNextXToPower, 17],
    [getNextXToPower, 18],
    [getNextXToPower, 19],
    [getNextSquareToDimension, 2],
    [getNextSquareToDimension, 3],
    [getNextSquareToDimension, 4],
    getNextFibonacci,
    getNextTriangle,
    getNextSquareTriangle,
];
const initCheckedUnits = ["week", "day", "hour", "minute", "second"];
// checked
function getInterestingValues(n) {
    const interestingValues = [];
    if (n > 2) {
        const lucas = getNextLucas(n);
        interestingValues.push(lucas);
    }
    for (const s in sequences) {
        const sequence = sequences[s];
        const index = sequence.numbers.findIndex((number) => number >= n);
        if (index != -1) {
            interestingValues.push({
                value: sequence.numbers[index],
                description: sequence.description,
                index: index,
            });
        }
    }
    const results = initInterestingNums.map((entry) => {
        if (Array.isArray(entry)) {
            const [func, arg] = entry;
            return func(n, arg);
        }
        return entry(n);
    });
    return interestingValues.concat(results);
}
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
    console.log("baba", numbers);
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
// checked
function getCheckedUnits() {
    const checkedUnits = {};
    for (const time in timeConsts) {
        const unit = timeConsts[time];
        const checkbox = document.getElementById(`checkbox${capitalize(time)}`);
        if (checkbox.checked) {
            checkedUnits[time] = unit;
        }
    }
    return checkedUnits;
}
// checked
function createCheckbox(id, label) {
    const labelElement = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "12px";
    checkbox.id = `checkbox${capitalize(id)}`;
    labelElement.append(checkbox, label);
    return labelElement;
}
// checked (no pun tended)
function createTimeOptions() {
    const drawer = document.getElementById("unitDrawer");
    const allCheckboxContainer = createCheckbox("All", "select all");
    drawer.append(allCheckboxContainer);
    for (const time in timeConsts) {
        const unit = timeConsts[time];
        const checkboxContainer = createCheckbox(time, unit.label);
        const checkbox = checkboxContainer.children[0];
        checkbox.checked = initCheckedUnits.includes(time);
        drawer.append(checkboxContainer);
    }
    allCheckboxContainer.addEventListener("click", () => {
        const allCheckbox = document.getElementById("checkboxAll");
        const isChecked = allCheckbox.checked;
        for (const time in timeConsts) {
            const checkboxI = document.getElementById(`checkbox${capitalize(time)}`);
            checkboxI.checked = isChecked;
        }
    });
}
document
    .getElementById("getDatesButton")
    .addEventListener("click", submitDatesCalculation);
function submitDatesCalculation() {
    const output = document.getElementById("output");
    const birthdateInput = document.getElementById("birthdateInput");
    const birthTimeInput = document.getElementById("birthTimeInput");
    const beginDate = Temporal.Instant.from(`${birthdateInput.value}T00Z`);
    const now = Temporal.Now.instant();
    const duration = now.since(beginDate);
    const units = getCheckedUnits();
    const tenYears = Temporal.Duration.from({ years: 10 });
    const maxDate = Temporal.Now.instant().add(tenYears);
    const dates = getNextDates(duration.seconds, units, [], maxDate);
    console.log("hi", dates);
    // clear any previous rows
    output.replaceChildren();
    //dates.forEach((date) => {
    //  createRow(units[time].label, dates[time]);
    //});
}
// checked
document
    .getElementById("timeZones")
    .addEventListener("change", revealExtendedTimeZones);
// checked
function revealExtendedTimeZones() {
    const timeZones = document.getElementById("timeZones");
    const inputLabel = document.getElementById("timeZonesExtendedLabel");
    inputLabel.classList.remove("hidden");
    if (timeZones.value !== "(other)") {
        inputLabel.classList.add("hidden");
    }
}
// checked
document
    .getElementById("unitLegend")
    .addEventListener("click", toggleUnitsDrawer);
// checked
function toggleUnitsDrawer() {
    const drawer = document.getElementById("unitDrawer");
    const upArrow = document.getElementById("unitUpArrow");
    const downArrow = document.getElementById("unitDownArrow");
    // @ts-ignore if it ain't broke don't fix it
    drawer.value = !drawer.value;
    // @ts-ignore
    if (drawer.value) {
        drawer.classList.remove("hidden");
        downArrow.classList.add("hidden");
        upArrow.classList.remove("hidden");
    }
    else {
        drawer.classList.add("hidden");
        downArrow.classList.remove("hidden");
        upArrow.classList.add("hidden");
    }
}
// checked
createTimeOptions();
