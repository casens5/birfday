import { getInterestingNumbers, InterestingNumberType } from "./math.js";
import { isZonedDateTimeInBounds, TimeConstType } from "./timeConsts.js";
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
  units: TimeConstType[],
  //numbers: InterestingNumberType[],
  maxDate: Temporal.ZonedDateTime,
) {
  const dates: DateRow[] = [];
  units.forEach((unit) => {
    // overly complex implementation of % which handles floats as moduluses
    const secondsRemaining = Math.ceil(
      (duration.seconds / unit.seconds -
        Math.floor(duration.seconds / unit.seconds)) *
        unit.seconds,
    );

    const now = Temporal.Now.zonedDateTimeISO("utc");
    const nextDuration = Temporal.Duration.from({ seconds: secondsRemaining });
    const nextDate = now.add(nextDuration);
    const nextAge = Math.ceil(duration.seconds / unit.seconds);

    const interestingNumbers = getInterestingNumbers(nextAge);
    interestingNumbers.sort((a, b) => a.value - b.value);

    dates.push({
      value: nextAge,
      date: nextDate,
      description: "next integer",
      timeUnit: unit.label,
      index: nextAge,
    });

    // .every() loop to break for large durations
    interestingNumbers.every((interestingNumber) => {
      const thisDuration = Temporal.Duration.from({
        seconds: Math.ceil(
          interestingNumber.value * unit.seconds - duration.seconds,
        ),
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
  const timeZoneSelect = document.getElementById(
    "timeZones",
  ) as HTMLSelectElement;

  const birthdateString = `${birthdateInput.value}T${birthTimeInput.value}Z[${timeZoneSelect.value}]`;
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
