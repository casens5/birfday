"use strict";

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function capitalize(string: string): string {
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

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

interface SequenceType {
  numbers: number[];
  description: string;
}

interface SequencesType {
  mersennePrime: SequenceType;
  perfect: SequenceType;
  taxicab: SequenceType;
  lehmer: SequenceType;
}

const sequences: SequencesType = {
  mersennePrime: {
    numbers: [3, 7, 31, 127, 8191, 131071, 524287, 2147483647],
    description: "mersenne prime",
  },
  perfect: {
    numbers: [],
    description: "perfect number",
  },
  taxicab: {
    numbers: [1729],
    description: "taxicab",
  },
  lehmer: {
    numbers: [276, 552, 564, 660, 966],
    description: "lehmer number",
  },
};

sequences.perfect.numbers = sequences.mersennePrime.numbers.map(
  (x) => x * ((x + 1) / 2),
);
// the last mersenne produces a perfect number larger than default integer size
sequences.perfect.numbers.pop();

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

//function getCheckedUnits(): TimeConstsType {
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

createTimeOptions();

function createRow(
  type: string,
  val: number,
  date: Date,
  specialVal: number,
  specialDate: Date,
) {
  const row = document.createElement("div");
  row.classList.add("gridRow");

  const numberType = document.createElement("div");
  numberType.classList.add("gridCell");
  numberType.classList.add("border-left");
  numberType.textContent = type;

  const nextVal = document.createElement("div");
  nextVal.classList.add("gridCell");
  nextVal.textContent = val.toString();

  const nextDate = document.createElement("div");
  nextDate.classList.add("gridCell");
  nextDate.textContent = date.toLocaleString();

  const nextInterestingVal = document.createElement("div");
  nextInterestingVal.classList.add("gridCell");
  nextInterestingVal.textContent = specialVal.toString();

  const nextInterestingDate = document.createElement("div");
  nextInterestingDate.classList.add("gridCell");
  nextInterestingDate.textContent = specialDate.toLocaleString();

  row.append(numberType);
  row.append(nextVal);
  row.append(nextDate);
  row.append(nextInterestingVal);
  row.append(nextInterestingDate);

  const output = $("output")!;
  output.append(row);
}

createRow("baba", 1, new Date(2001, 1, 5), 5, new Date());

console.log("the numbers", sequences);

const output = $("output")!;

$("getDatesButton")!.addEventListener("click", () => {
  const birthdate = Math.floor(
    // @ts-ignore
    (new Date().valueOf() - new Date($("birthdateInput").value).valueOf()) /
      1000,
  );
  console.log("hi there", birthdate);
  output.textContent = `${(birthdate / timeConsts.marsYear.seconds).toFixed(3)} mars years`;
  getNextDates(birthdate);
  getCheckedUnits();
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

function getNextDates(inputTimestamp: number) {
  const dates = {};
  for (const time in timeConsts) {
    // @ts-ignore
    const age = inputTimestamp / timeConsts[time].seconds;
    const nextAge = Math.ceil(age);
    // @ts-ignore
    const timeDelta = Math.round((nextAge - age) * timeConsts[time].seconds);
    const nextDate = new Date(new Date().valueOf() + timeDelta * 1000);

    // @ts-ignore
    dates[time] = {
      age: age,
      nextAge: nextAge,
      timeDelta: timeDelta,
      nextDate: nextDate,
    };
  }
  console.log("the dates", dates);
  return dates;
}
