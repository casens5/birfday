// utils ****

function capitalize(string: string): string {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

// timeConsts ****

interface TimeConstType {
  seconds: number;
  label: string;
}

interface TimeConstsType {
  [key: string]: TimeConstType;
}

const initCheckedUnits: string[] = ["week", "day", "hour", "minute", "second"];

const timeConsts: TimeConstsType = {
  week: {
    seconds: 604_800,
    label: "week",
  },
  day: {
    seconds: 86_400,
    label: "day",
  },
  hour: {
    seconds: 3_600,
    label: "hour",
  },
  minute: {
    seconds: 60,
    label: "minute",
  },
  second: {
    seconds: 1, // woah
    label: "second",
  },
  sunDay: {
    seconds: 2_191_832,
    label: "sun day (sidereal)",
  },
  moonYearSyn: {
    seconds: 2_551_442.9,
    label: "moon year (synodic orbit)",
  },
  moonYearSid: {
    seconds: 2_360_591.5,
    label: "moon year (sidereal orbit)",
  },
  mercuryDay: {
    seconds: 5_067_360,
    label: "mercury day (synodic rotation)",
  },
  mercuryYear: {
    seconds: 7_600_521.6,
    label: "mercury year (sidereal orbit)",
  },
  venusDay: {
    seconds: 242_092_800,
    label: "venus day (synodic rotation)",
  },
  venusYear: {
    seconds: 19_414_166.4,
    label: "venus year (sidereal orbit)",
  },
  marsDay: {
    seconds: 88_774.92,
    label: "mars day (synodic rotation)",
  },
  marsYear: {
    seconds: 59_355_072,
    label: "mars year (sidereal orbit)",
  },
  ceresDay: {
    seconds: 3_266.4,
    label: "ceres day (synodic rotation)",
  },
  ceresYear: {
    seconds: 145_164_960,
    label: "ceres year (sidereal orbit)",
  },
  jupiterDay: {
    seconds: 35_733.24,
    label: "jupiter day (synodic rotation)",
  },
  jupiterYear: {
    seconds: 374_335_689.6,
    label: "jupiter year (sidereal orbit)",
  },
  saturnDay: {
    seconds: 38_361.6,
    label: "saturn day (synodic rotation)",
  },
  saturnYear: {
    seconds: 929_596_608,
    label: "saturn year (sidereal orbit)",
  },
  uranusDay: {
    seconds: 62_064,
    label: "uranus day (synodic rotation)",
  },
  uranusYear: {
    seconds: 2_651_218_560,
    label: "uranus year (sidereal orbit)",
  },
  neptuneDay: {
    seconds: 57_996,
    label: "neptune day (synodic rotation)",
  },
  neptuneYear: {
    seconds: 5_200_331_155.2,
    label: "neptune year (sidereal orbit)",
  },
  plutoDay: {
    seconds: 551_815.2,
    label: "pluto day (synodic rotation)",
  },
  plutoYear: {
    seconds: 7_824_384_000,
    label: "pluto year (sidereal orbit)",
  },
  /*
    planck: {
      seconds: 5.391_247 * 10 ** -44,
      label: "planck seconds",
    },
    cesium: {
      seconds: 1 / 9_192_631_770,
      label: "cesium",
    },
  */
};

// number sequences ****

interface SequenceType {
  numbers: number[];
  label: string;
}

interface SequencesType {
  [key: string]: SequenceType;
}

const sequences: SequencesType = {
  mersennePrime: {
    numbers: [3, 7, 31, 127, 8191, 131071, 524287, 2147483647],
    label: "mersenne prime",
  },
  perfect: {
    numbers: [],
    label: "perfect number",
  },
  taxicab: {
    numbers: [1729],
    label: "taxicab number",
  },
  lehmer: {
    numbers: [276, 552, 564, 660, 966],
    label: "lehmer number",
  },
};

// compute perfect numbers via the mersennes
sequences.perfect.numbers = sequences.mersennePrime.numbers.map(
  (x) => x * ((x + 1) / 2),
);
// the last mersenne produces a perfect number larger than default integer size
sequences.perfect.numbers.pop();

// number getter functions ****

interface AnnotatedNumber {
  value: number;
  index: number;
}

function getNextBase10(n: number): AnnotatedNumber {
  if (n < 0) {
    return {
      value: 0,
      index: 0,
    };
  }
  const digits = Math.floor(Math.log(n) / Math.log(10));
  if (digits < 1) {
    return {
      value: n,
      index: n,
    };
  }
  return {
    value: Math.ceil(n / 10 ** digits) * 10 ** digits,
    index: 1,
  };
}

function getNextRepDigit(n: number): AnnotatedNumber {
  const initialDigit = parseInt(n.toString().slice(0, 1));
  const numLength = Math.floor(Math.log(n) / Math.log(10)) + 1;
  const repDigit = parseInt(new Array(numLength).fill(initialDigit).join(""));
  if (repDigit >= n) {
    return {
      value: repDigit,
      index: 1,
    };
  } else {
    return {
      value: parseInt(new Array(numLength).fill(initialDigit + 1).join("")),
      index: 1,
    };
  }
}

function getNextXToPower(n: number, power: number): AnnotatedNumber {
  return {
    value:
      power ** Math.ceil(Number((Math.log(n) / Math.log(power)).toFixed(5))),
    index: Math.ceil(Number((Math.log(n) / Math.log(power)).toFixed(5))),
  };
}

function getNextSquareToDimension(
  n: number,
  dimension: number,
): AnnotatedNumber {
  return {
    value: Math.ceil(n ** (1 / dimension)) ** dimension,
    index: Math.ceil(n ** (1 / dimension)),
  };
}

function getNextFibonacci(n: number): AnnotatedNumber {
  if (n === 0) {
    return { value: 0, index: 0 };
  }
  const phi = (1 + 5 ** (1 / 2)) / 2;
  let base = 1 + Math.floor(Math.log(n) / Math.log(phi));
  function binet(n: number) {
    return Math.round((phi ** n - (1 - phi) ** n) / 5 ** (1 / 2));
  }

  // why be a good mathematician anyway?
  for (let i = 0; i < 10; i++) {
    if (binet(base) >= n) {
      return { value: binet(base), index: base };
    }
    base += 1;
  }
  // should never happen >:(
  return { value: 0, index: 0 };
}

function getNextLucas(n: number): AnnotatedNumber {
  // ONLY WORKS FOR N > 3
  if (n < 3) {
    return { value: -1, index: -1 };
  }

  const phi = (1 + 5 ** (1 / 2)) / 2;
  let base = Math.round(Math.log(n) / Math.log(phi));
  function luca(n: number) {
    return Math.round(phi ** n - (1 - phi) ** n);
  }

  // why be a good mathematician anyway?
  for (let i = 0; i < 10; i++) {
    if (luca(base) >= n) {
      return { value: luca(base), index: base };
    }
    base += 1;
  }
  // should never happen
  return { value: 0, index: 0 };
}

function getNextTriSquare(n: number): AnnotatedNumber {
  let i = 0;
  let nums = [0];
  while (nums[i] < n) {
    i++;
    nums.push(
      Math.round(
        ((3 + 2 * (2 ** 0.5) ** i - (3 - 2 * (2 ** 0.5) ** i)) /
          (4 * 2 ** 0.5)) **
          2,
      ),
    );
  }

  return { value: nums[i - 1], index: i - 1 };
}

function getNextTriangle(n: number): AnnotatedNumber {
  const base = Math.ceil((-1 + (1 + 8 * n) ** (1 / 2)) / 2);
  return { value: (base ** 2 + base) / 2, index: base };
}

/*function getNextTetration(n: number): AnnotatedNumber {
  // should make the sequence 2, 4, 16, 65_536, etc
}*/

function getInterestingValues(n: number): InterestingValueType[] {
  const interestingValues = [
    {
      value: getNextBase10(n).value,
      label: "base 10",
    },
    {
      value: getNextRepDigit(n).value,
      label: "repeated digit",
    },
    {
      value: getNextTriangle(n).value,
      label: `triangle number, T(${getNextTriangle(n).index})`,
    },
    {
      value: getNextFibonacci(n).value,
      label: `fibonacci number, F(${getNextFibonacci(n).index})`,
    },
    {
      value: getNextSquareToDimension(n, 2).value,
      label: `square number, ${getNextSquareToDimension(n, 2).index}^2`,
    },
    {
      value: getNextSquareToDimension(n, 3).value,
      label: `cube number, ${getNextSquareToDimension(n, 3).index}^3`,
    },
    {
      value: getNextSquareToDimension(n, 4).value,
      label: `tessaract number, ${getNextSquareToDimension(n, 4).index}^4`,
    },
    {
      value: getNextXToPower(n, 2).value,
      label: `2^${getNextXToPower(n, 2).index}`,
    },
    {
      value: getNextXToPower(n, 3).value,
      label: `3^${getNextXToPower(n, 3).index}`,
    },
    {
      value: getNextXToPower(n, 5).value,
      label: `5^${getNextXToPower(n, 5).index}`,
    },
    {
      value: getNextXToPower(n, 6).value,
      label: `6^${getNextXToPower(n, 6).index}`,
    },
    {
      value: getNextXToPower(n, 7).value,
      label: `7^${getNextXToPower(n, 7).index}`,
    },
    {
      value: getNextXToPower(n, 10).value,
      label: `10^${getNextXToPower(n, 10).index}`,
    },
    {
      value: getNextXToPower(n, 11).value,
      label: `11^${getNextXToPower(n, 11).index}`,
    },
    {
      value: getNextXToPower(n, 12).value,
      label: `12^${getNextXToPower(n, 12).index}`,
    },
    {
      value: getNextXToPower(n, 13).value,
      label: `13^${getNextXToPower(n, 13).index}`,
    },
    {
      value: getNextXToPower(n, 14).value,
      label: `14^${getNextXToPower(n, 14).index}`,
    },
    {
      value: getNextXToPower(n, 15).value,
      label: `15^${getNextXToPower(n, 15).index}`,
    },
    {
      value: getNextXToPower(n, 17).value,
      label: `17^${getNextXToPower(n, 17).index}`,
    },
    {
      value: getNextXToPower(n, 18).value,
      label: `18^${getNextXToPower(n, 18).index}`,
    },
    {
      value: getNextXToPower(n, 19).value,
      label: `19^${getNextXToPower(n, 19).index}`,
    },
    {
      value: getNextXToPower(n, 20).value,
      label: `20^${getNextXToPower(n, 20).index}`,
    },
    {
      value: getNextXToPower(n, 21).value,
      label: `21^${getNextXToPower(n, 21).index}`,
    },
  ];

  if (n > 2) {
    interestingValues.push({
      value: getNextLucas(n).value,
      label: `lucas number, L(${getNextLucas(n).index})`,
    });
  }

  for (const s in sequences) {
    const sequence = sequences[s];
    const nextValue = sequence.numbers.find((number: number) => number >= n);
    if (nextValue != null) {
      interestingValues.push({
        value: nextValue,
        label: sequence.label,
      });
    }
  }

  return interestingValues;
}

// dom functions ****

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
    // @ts-ignore
    document.getElementById(`checkbox${capitalize(time)}`)!.checked =
      initCheckedUnits.includes(time);
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
  date?: Date;
  label: string;
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
    labelDiv.textContent = value.label.toString();
    dateDiv.textContent = value.date;
  });
}

function getNextDates(
  inputTimestamp: number,
  units: TimeConstsType,
  numbers: InterestingValueType,
  maxDate: Temporal.Duration,
) {
  const dates = {};
  for (const time in units) {
    const age = inputTimestamp / timeConsts[time].seconds;
    const nextAge = Math.ceil(age);
    const timeDelta = Math.round((nextAge - age) * timeConsts[time].seconds);
    const nextDate = new Date(new Date().valueOf() + timeDelta * 1000);

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

    const valuesWithDates = [];
    filteredVals.forEach((interestingValue) => {
      const thisDelta = Math.round(
        (interestingValue.value - age) * timeConsts[time].seconds,
      );
      const thisDate = new Date(new Date().valueOf() + thisDelta * 1000);
      if (thisDate < maxDate) {
        valuesWithDates.push({
          value: interestingValue.value,
          date: new Date(new Date().valueOf() + thisDelta * 1000),
          label: interestingValue.label,
        });
      }
    });

    dates[time] = [
      {
        value: nextAge,
        date: nextDate,
        label: "next integer",
      },
      ...valuesWithDates,
    ];
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
  const now = Temporal.Now.instant()
  const duration = now.since(beginDate);
  const units = getCheckedUnits();
  const tenYears = Temporal.Duration.from({ years: 9 });
  const dates = getNextDates(duration.seconds, units, null, tenYears);

  // clear any previous rows
  output.replaceChildren();

  for (const time in dates) {
    createRow(units[time].label, dates[time]);
  }
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
