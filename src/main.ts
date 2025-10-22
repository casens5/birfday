import { getInterestingValues, InterestingValueType } from "./math.js";
import { timeConsts, TimeConstsType } from "./timeConsts.js";
import { getCheckedUnits } from "./unitSelector.js";

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
