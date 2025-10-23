import { getInterestingValues, InterestingNumberType } from "./math.js";
import { timeConsts, TimeConstsType } from "./timeConsts.js";
import { getTimeZone } from "./timeZoneSelector.js";
import { getCheckedUnits } from "./unitSelector.js";

interface DateRow extends InterestingNumberType {
  date: Temporal.ZonedDateTime;
  timeUnit: string;
}

function createRow(dateRow: DateRow): HTMLTableRowElement {
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

function getNextDates(
  duration: Temporal.Duration,
  units: TimeConstsType,
  //numbers: InterestingNumberType[],
  maxDate: Temporal.ZonedDateTime,
) {
  const dates: DateRow[] = [];
  for (const time in units) {
    // overly complex implementation of % which handles floats as moduluses
    const secondsRemaining = Math.ceil(
      (duration.seconds / timeConsts[time].seconds -
        Math.floor(duration.seconds / timeConsts[time].seconds)) *
        timeConsts[time].seconds,
    );
    const nextDuration = Temporal.Duration.from({ seconds: secondsRemaining });
    const nextDate = Temporal.Now.zonedDateTimeISO("utc").add(nextDuration);

    const nextAge = Math.ceil(duration.seconds / timeConsts[time].seconds);
    const interestingValues = getInterestingValues(nextAge);
    interestingValues.sort((a, b) => a.value - b.value);

    dates.push({
      value: nextAge,
      date: nextDate,
      description: "next integer",
      timeUnit: units[time].label,
      index: nextAge,
    });

    interestingValues.forEach((interestingValue) => {
      const thisDuration = Temporal.Duration.from({
        seconds: Math.round(
          interestingValue.value * timeConsts[time].seconds - duration.seconds,
        ),
      });
      const thisDate = Temporal.Now.zonedDateTimeISO("utc").add(thisDuration);

      if (Temporal.ZonedDateTime.compare(thisDate, maxDate) < 0) {
        dates.push({
          value: interestingValue.value,
          date: thisDate,
          description: interestingValue.description,
          timeUnit: units[time].label,
          index: interestingValue.index,
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
  const table = document.getElementById("outputTable") as HTMLTableElement;
  table.classList.remove("hidden");

  const birthdateInput = document.getElementById(
    "birthdateInput",
  ) as HTMLInputElement;
  const birthTimeInput = document.getElementById(
    "birthTimeInput",
  ) as HTMLInputElement;
  const timeZone = getTimeZone();

  const birthdateString = `${birthdateInput.value}T${birthTimeInput.value}Z[${timeZone}]`;
  const startDate = Temporal.ZonedDateTime.from(birthdateString);

  const now = Temporal.Now.instant();
  const duration = now.since(startDate.toInstant());
  const nowISO = now.toZonedDateTimeISO("utc");
  const maxDate = nowISO.add({ years: 10 });

  const units = getCheckedUnits();
  const dates = getNextDates(duration, units, maxDate);

  const output = document.getElementById("output")!;
  // clear any previous rows
  output.replaceChildren();

  dates.forEach((date) => {
    const row = createRow(date);
    output.append(row);
  });
}
