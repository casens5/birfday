"use strict";

// *********
// utils
// *********

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function capitalize(string: string): string {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

// *********
// timeConsts
// *********

interface TimeConstType {
  seconds: number;
  label: string;
  isChecked: boolean;
}

interface TimeConstsType {
  [key: string]: TimeConstType;
}

const timeConsts: TimeConstsType = {
  week: {
    seconds: 604_800,
    label: "week",
    isChecked: true,
  },
  day: {
    seconds: 86_400,
    label: "day",
    isChecked: true,
  },
  hour: {
    seconds: 3_600,
    label: "hour",
    isChecked: true,
  },
  minute: {
    seconds: 60,
    label: "minute",
    isChecked: true,
  },
  second: {
    seconds: 1, // woah
    label: "second",
    isChecked: true,
  },
  sunDay: {
    seconds: 2_191_832,
    label: "sun day (sidereal)",
    isChecked: false,
  },
  moonYearSyn: {
    seconds: 2_551_442.9,
    label: "moon year (synodic orbit)",
    isChecked: false,
  },
  moonYearSid: {
    seconds: 2_360_591.5,
    label: "moon year (sidereal orbit)",
    isChecked: false,
  },
  mercuryDay: {
    seconds: 5_067_360,
    label: "mercury day (synodic rotation)",
    isChecked: false,
  },
  mercuryYear: {
    seconds: 7_600_521.6,
    label: "mercury year (sidereal orbit)",
    isChecked: false,
  },
  venusDay: {
    seconds: 242_092_800,
    label: "venus day (synodic rotation)",
    isChecked: false,
  },
  venusYear: {
    seconds: 19_414_166.4,
    label: "venus year (sidereal orbit)",
    isChecked: false,
  },
  marsDay: {
    seconds: 88_774.92,
    label: "mars day (synodic rotation)",
    isChecked: false,
  },
  marsYear: {
    seconds: 59_355_072,
    label: "mars year (sidereal orbit)",
    isChecked: false,
  },
  ceresDay: {
    seconds: 3_266.4,
    label: "ceres day (synodic rotation)",
    isChecked: false,
  },
  ceresYear: {
    seconds: 145_164_960,
    label: "ceres year (sidereal orbit)",
    isChecked: false,
  },
  jupiterDay: {
    seconds: 35_733.24,
    label: "jupiter day (synodic rotation)",
    isChecked: false,
  },
  jupiterYear: {
    seconds: 374_335_689.6,
    label: "jupiter year (sidereal orbit)",
    isChecked: false,
  },
  saturnDay: {
    seconds: 38_361.6,
    label: "saturn day (synodic rotation)",
    isChecked: false,
  },
  saturnYear: {
    seconds: 929_596_608,
    label: "saturn year (sidereal orbit)",
    isChecked: false,
  },
  uranusDay: {
    seconds: 1_489_536,
    label: "uranus day (synodic rotation)",
    isChecked: false,
  },
  uranusYear: {
    seconds: 2_651_218_560,
    label: "uranus year (sidereal orbit)",
    isChecked: false,
  },
  neptuneDay: {
    seconds: 1_391_904,
    label: "neptune day (synodic rotation)",
    isChecked: false,
  },
  neptuneYear: {
    seconds: 5_198_601_600,
    label: "neptune year (sidereal orbit)",
    isChecked: false,
  },
  plutoDay: {
    seconds: 13_243_564.8,
    label: "pluto day (synodic rotation)",
    isChecked: false,
  },
  plutoYear: {
    seconds: 7_824_384_000,
    label: "pluto year (sidereal orbit)",
    isChecked: false,
  },
  planck: {
    seconds: 5.391_247 * 10 ** -44,
    label: "planck seconds",
    isChecked: false,
  },
  cesium: {
    seconds: 1 / 9_192_631_770,
    label: "cesium",
    isChecked: false,
  },
};

// *********
// number sequences
// *********

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

// *********
// number getter functions
// *********

function getNextRepDigit(n: number): number {
  const initialDigit = parseInt(n.toString().slice(0, 1));
  const numLength = Math.floor(Math.log(n) / Math.log(10)) + 1;
  const repDigit = parseInt(new Array(numLength).fill(initialDigit).join(""));
  if (repDigit >= n) {
    return repDigit;
  } else {
    return parseInt(new Array(numLength).fill(initialDigit + 1).join(""));
  }
}

function getNextXToPower(n: number, power: number): number {
  return power ** Math.ceil(Number((Math.log(n) / Math.log(power)).toFixed(5)));
}

function getNextSquareToDimension(n: number, dimension: number): number {
  return Math.ceil(n ** (1 / dimension)) ** dimension;
}

function getNextFibonacci(n: number): number {
  if (n === 0) {
    return 0;
  }
  const phi = (1 + 5 ** (1 / 2)) / 2;
  let base = 1 + Math.floor(Math.log(n) / Math.log(phi));
  function binet(n: number) {
    return Math.round((phi ** n - (1 - phi) ** n) / 5 ** (1 / 2));
  }

  // why be a good mathematician anyway?
  for (let i = 0; i < 10; i++) {
    if (binet(base) >= n) {
      return binet(base);
    }
    base += 1;
  }
  // should never happen >:(
  return 0;
}

function getNextBase10(n: number): number {
  if (n < 0) {
    return n;
  }
  const digits = Math.floor(Math.log(n) / Math.log(10));
  if (digits < 1) {
    return n;
  }
  return Math.ceil(n / 10 ** digits) * 10 ** digits;
}

// ONLY WORKS FOR N > 3
function getNextLucas(n: number): number {
  const phi = (1 + 5 ** (1 / 2)) / 2;
  let base = Math.round(Math.log(n) / Math.log(phi));
  function luca(n: number) {
    return Math.round(phi ** n - (1 - phi) ** n);
  }

  // why be a good mathematician anyway?
  for (let i = 0; i < 10; i++) {
    if (luca(base) >= n) {
      return luca(base);
    }
    base += 1;
  }
  // should never happen
  return 0;
}

function getNextTriangle(n: number): number {
  const base = Math.ceil((-1 + (1 + 8 * n) ** (1 / 2)) / 2);
  return (base ** 2 + base) / 2;
}

function getInterestingValues(n: number): InterestingValueType[] {
  const interestingValues = [
    {
      value: getNextBase10(n),
      label: "base 10",
    },
    {
      value: getNextLucas(n),
      label: "lucas number",
    },
    {
      value: getNextRepDigit(n),
      label: "repeated digit",
    },
    {
      value: getNextTriangle(n),
      label: "triangle number",
    },
    {
      value: getNextFibonacci(n),
      label: "fibonacci number",
    },
    {
      value: getNextSquareToDimension(n, 2),
      label: "square number",
    },
    {
      value: getNextSquareToDimension(n, 3),
      label: "cube number",
    },
    {
      value: getNextSquareToDimension(n, 4),
      label: "tessaract number",
    },
  ];

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

  // @ts-ignore
  return interestingValues;
}

// *********
// dom functions
// *********

function createCheckbox(id: string, label: string, isChecked = true) {
  const labelElement = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  // @ts-ignore
  checkbox.checked = isChecked;
  checkbox.style.marginRight = "12px";
  checkbox.id = `checkbox${capitalize(id)}`;
  labelElement.append(checkbox, label);
  return labelElement;
}

function createTimeOptions() {
  const drawer = $("unitDrawer")!;
  for (const time in timeConsts) {
    // @ts-ignore
    const unit = timeConsts[time];
    const input = createCheckbox(time, unit.label, unit.isChecked);
    drawer.append(input);
  }
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

  const output = $("output")!;
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
    dateDiv.textContent = value.date!.toLocaleString();
  });
}

function getNextDates(
  inputTimestamp: number,
  units: TimeConstsType,
  numbers: InterestingValueType,
  maxDate: date,
) {
  const dates = {};
  for (const time in units) {
    // @ts-ignore
    const age = inputTimestamp / timeConsts[time].seconds;
    const nextAge = Math.ceil(age);
    // @ts-ignore
    const timeDelta = Math.round((nextAge - age) * timeConsts[time].seconds);
    const nextDate = new Date(new Date().valueOf() + timeDelta * 1000);

    const interestingValues = getInterestingValues(nextAge);
    interestingValues.sort((a, b) => a.value - b.value);

    // @ts-ignore
    const valuesWithDates = [];
    interestingValues.forEach((interestingValue) => {
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

    // @ts-ignore
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
  const checkedUnits = {};
  for (const time in timeConsts) {
    const unit = timeConsts[time];
    // @ts-ignore
    const isChecked = $(`checkbox${capitalize(time)}`).checked;
    if (isChecked) {
      // @ts-ignore
      checkedUnits[time] = unit;
    }
  }
  console.log("nthnthnt", checkedUnits);
  return checkedUnits;
}

// *********
// event listeners
// *********

$("getDatesButton")!.addEventListener("click", () => {
  const output = $("output")!;
  const birthdate = Math.floor(
    // @ts-ignore
    (new Date().valueOf() - new Date($("birthdateInput").value).valueOf()) /
      1000,
  );
  const units = getCheckedUnits();
  const tenYears = new Date();
  tenYears.setFullYear(tenYears.getFullYear() + 10);
  const dates = getNextDates(birthdate, units, null, tenYears);
  console.log("the output", dates);

  // clear any previous rows
  output.replaceChildren();

  for (const time in dates) {
    createRow(units[time].label, dates[time]);
  }
});

$("unitLegend")!.addEventListener("click", () => {
  const drawer = $("unitDrawer")!;
  const upArrow = $("unitUpArrow")!;
  const downArrow = $("unitDownArrow")!;
  // @ts-ignore
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
});

createTimeOptions();
