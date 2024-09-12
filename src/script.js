"use strict";
function $(id) {
    return document.getElementById(id);
}
const timeConsts = {
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    sunDay: 2191832,
    moonYearSyn: 2551442.9, // synodic orbit
    moonYearSid: 2360591.5, // sidereal orbit
    mercuryDay: 364832640, // synodic rotation
    mercuryYear: 7600521.6, // sidereal orbit
    venusDay: 242092800, // synodic rotation
    venusYear: 19414166.4, // sidereal orbit
    marsDay: 88774.92, // synodic rotation
    marsYear: 59355072, // sidereal orbit
    ceresDay: 3266.4, // synodic rotation
    ceresYear: 145164960, // sidereal orbit
    jupiterDay: 35733.24, // synodic rotation
    jupiterYear: 374335689.6, // sidereal orbit
    saturnDay: 38361.6, // synodic rotation
    saturnYear: 929596608, // sidereal orbit 
    uranusDay: 1489536, // synodic rotation
    uranusYear: 2651218560, // sidereal orbit
    neptuneDay: 1391904, // synodic rotation
    neptuneYear: 5198601600, // sidereal orbit
    plutoDay: 13243564.8, // synodic rotation
    plutoYear: 7824384000, // sidereal orbit
    planck: 5.391247 * 10 ** -44,
    cesium: 1 / 9192631770,
};
const output = $("output");
$("getDatesButton").addEventListener("click", () => {
    const birthdate = Math.floor((new Date().valueOf() - new Date($("birthdateInput").value).valueOf()) /
        1000);
    console.log("hi there", birthdate);
    output.textContent = `${(birthdate / timeConsts.marsYear).toFixed(3)} mars years`;
    output.textContent += getNextDates(birthdate);
});
function getNextDates(inputTimestamp) {
    const dates = {};
    for (const time in timeConsts) {
        const age = inputTimestamp / timeConsts[time];
        const nextAge = Math.ceil(age);
        const timeDelta = Math.round((nextAge - age) * timeConsts[time]);
        const nextDate = new Date(new Date().valueOf() + timeDelta * 1000);
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
