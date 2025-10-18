import { capitalize } from "./utils.js";
import { timeConsts, TimeConstsType } from "./timeConsts.js";
import { sequences, getNextLucas } from "./math.js";

const initCheckedUnits: string[] = ["week", "day", "hour", "minute", "second"];

function getInterestingValues(n: number): InterestingValueType[] {
  const interestingValues = [];

  if (n > 2) {
    const lucas = getNextLucas(n);
    interestingValues.push(lucas);
  }

  for (const s in sequences) {
    const sequence = sequences[s];
    const index = sequence.numbers.findIndex((number: number) => number >= n);
    if (index != -1) {
      interestingValues.push({
        value: sequence.numbers[index],
        description: sequence.description,
        index: index,
      });
    }
  }

  return interestingValues;
}

console.log("fart", capitalize("baba"));

function createCheckbox(id: string, label: string) {
  const labelElement = document.createElement("label");
  const checkbox = document.createElement("input") as HTMLInputElement;
  checkbox.type = "checkbox";
  checkbox.style.marginRight = "12px";
  checkbox.id = `checkbox${capitalize(id)}`;
  labelElement.append(checkbox, label);
  return labelElement;
}

function createTimeOptions() {
  const drawer = document.getElementById("unitDrawer")!;
  const allCheckbox = createCheckbox("All", "select all");
  drawer.append(allCheckbox);

  for (const time in timeConsts) {
    const unit = timeConsts[time];
    const input = createCheckbox(time, unit.label);
    const checkbox = input.children[0] as HTMLInputElement;
    checkbox.checked = initCheckedUnits.includes(time);
    drawer.append(input);
  }

  allCheckbox.addEventListener("click", () => {
    const checkboxAll = document.getElementById(
      "checkboxAll",
    ) as HTMLInputElement;
    const isChecked = checkboxAll.checked;
    for (const time in timeConsts) {
      const checkboxI = document.getElementById(
        `checkbox${capitalize(time)}`,
      ) as HTMLInputElement;
      checkboxI.checked = isChecked;
    }
  });
}

interface InterestingValueType {
  value: number;
  date?: Temporal.ZonedDateTime;
  description: string;
  index: number;
}

function createRow(type: string, interestingValues: InterestingValueType[]) {
  const row = document.createElement("tr");

  const numberType = document.createElement("th");
  numberType.textContent = type;
  numberType.rowSpan = interestingValues.length;
  row.append(numberType);

  const output = document.getElementById("output")!;
  output.append(row);

  interestingValues.forEach((value, index) => {
    const valueDiv = document.createElement("td");
    const labelDiv = document.createElement("td");
    const dateDiv = document.createElement("td");
    if (index === 0) {
      row.append(valueDiv, labelDiv, dateDiv);
    } else {
      const subRow = document.createElement("tr");
      subRow.append(valueDiv, labelDiv, dateDiv);
      output.append(subRow);
    }

    valueDiv.textContent = value.value.toLocaleString();
    labelDiv.textContent = value.description.toString();
    dateDiv.textContent = value.date!.toString();
  });
}

function getNextDates(
  duration: number,
  units: TimeConstsType,
  numbers: InterestingValueType[],
  maxDate: Temporal.Instant,
) {
  const dates: InterestingValueType[] = [];
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
      } else {
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
        seconds: Math.round(
          (interestingValue.value - age) * timeConsts[time].seconds,
        ),
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

function getCheckedUnits() {
  const checkedUnits: TimeConstsType = {};
  for (const time in timeConsts) {
    const unit = timeConsts[time];
    const checkbox = document.getElementById(
      `checkbox${capitalize(time)}`,
    ) as HTMLInputElement;
    if (checkbox.checked) {
      checkedUnits[time] = unit;
    }
  }
  return checkedUnits;
}

// event listeners ****

document
  .getElementById("getDatesButton")!
  .addEventListener("click", submitDatesCalculation);

function submitDatesCalculation() {
  const output = document.getElementById("output")!;
  const birthdateInput = document.getElementById(
    "birthdateInput",
  ) as HTMLInputElement;
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

document
  .getElementById("unitLegend")!
  .addEventListener("click", toggleUnitsDrawer);

function toggleUnitsDrawer() {
  const drawer = document.getElementById("unitDrawer")!;
  const upArrow = document.getElementById("unitUpArrow")!;
  const downArrow = document.getElementById("unitDownArrow")!;
  // @ts-ignore if it ain't broke don't fix it
  drawer.value = !drawer.value;
  // @ts-ignore
  if (drawer.value) {
    drawer.classList.remove("hidden");
    downArrow.classList.add("hidden");
    upArrow.classList.remove("hidden");
  } else {
    drawer.classList.add("hidden");
    downArrow.classList.remove("hidden");
    upArrow.classList.add("hidden");
  }
}

createTimeOptions();
