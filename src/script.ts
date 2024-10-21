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
  mercuryDay: 364_832_640, // synodic rotation
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
