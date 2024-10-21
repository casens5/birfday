"use strict";

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

const timeConsts = {
  week: 604_800,
  day: 86_400,
  hour: 3_600,
  minute: 60,
  sunDay: 2_191_832,
  moonYearSyn: 2_551_442.9, // synodic orbit
  moonYearSid: 2_360_591.5, // sidereal orbit
  mercuryDay: 5_067_360, // synodic rotation
  mercuryYear: 7_600_521.6, // sidereal orbit
  venusDay: 242_092_800, // synodic rotation
  venusYear: 19_414_166.4, // sidereal orbit
  marsDay: 88_774.92, // synodic rotation
  marsYear: 59_355_072, // sidereal orbit
  ceresDay: 3_266.4, // synodic rotation
  ceresYear: 145_164_960, // sidereal orbit
  jupiterDay: 35_733.24, // synodic rotation
  jupiterYear: 374_335_689.6, // sidereal orbit
  saturnDay: 38_361.6, // synodic rotation
  saturnYear: 929_596_608, // sidereal orbit 
  uranusDay: 1_489_536, // synodic rotation
  uranusYear: 2_651_218_560, // sidereal orbit
  neptuneDay: 1_391_904, // synodic rotation
  neptuneYear: 5_198_601_600, // sidereal orbit
  plutoDay: 13_243_564.8, // synodic rotation
  plutoYear: 7_824_384_000, // sidereal orbit
  planck: 5.391_247 * 10 ** -44,
  cesium: 1 / 9_192_631_770,
};

const sequences = {
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

function getNextRepDigit(n: number) {
  const initialDigit = parseInt(n.toString().slice(0, 1));
  const numLength = Math.floor(Math.log(n) / Math.log(10)) + 1;
  const repDigit = parseInt(new Array(numLength).fill(initialDigit).join(""));
  if (repDigit >= n) {
    return repDigit;
  } else {
    return parseInt(new Array(numLength).fill(initialDigit + 1).join(""));
  }
}

function getNextXToPower(n: number, power: number) {
  return power ** Math.ceil(Math.log(n) / Math.log(power));
}

function getNextBaseToX(n: number, base: number) {
  return base ** Math.ceil(n ** (1 / base));
}

function getNextFibonacci(n: number) {
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

function getNextBase10(n: number) {
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
function getNextLucas(n: number) {
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

function getNextTriangle(n) {
  const base = Math.ceil((-1 + (1 + 8 * n) ** (1 / 2)) / 2);
  return (base ** 2 + base) / 2;
}

console.log("babo", sequences);

const output = $("output");

$("getDatesButton")!.addEventListener("click", () => {
  const birthdate = Math.floor(
    // @ts-ignore
    (new Date().valueOf() - new Date($("birthdateInput")!.value).valueOf()) /
      1000,
  );
  console.log("hi there", birthdate);
  output!.textContent = `${(birthdate / timeConsts.marsYear).toFixed(3)} mars years`;
  output!.textContent += getNextDates(birthdate);
});

function getNextDates(inputTimestamp: number) {
  const dates = {};
  for (const time in timeConsts) {
    // @ts-ignore
    const age = inputTimestamp / timeConsts[time];
    const nextAge = Math.ceil(age);
    // @ts-ignore
    const timeDelta = Math.round((nextAge - age) * timeConsts[time]);
    const nextDate = new Date(new Date().valueOf() + timeDelta * 1000);
    // @ts-ignore
    dates[time] = {
      age: age,
      nextAge: nextAge,
      timeDelta: timeDelta,
      nextDate: nextDate,
    };
  }
  console.log("tnhnhtn", dates);
  return dates;
}
