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
    moonYearSyn: 2551442.9,
    moonYearSid: 2360591.5,
    mercuryDay: 5067360,
    mercuryYear: 7600521.6,
    venusDay: 242092800,
    venusYear: 19414166.4,
    marsDay: 88774.92,
    marsYear: 59355072,
    ceresDay: 3266.4,
    ceresYear: 145164960,
    jupiterDay: 35733.24,
    jupiterYear: 374335689.6,
    saturnDay: 38361.6,
    saturnYear: 929596608,
    uranusDay: 1489536,
    uranusYear: 2651218560,
    neptuneDay: 1391904,
    neptuneYear: 5198601600,
    plutoDay: 13243564.8,
    plutoYear: 7824384000,
    planck: 5.391247 * 10 ** -44,
    cesium: 1 / 9192631770,
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
sequences.perfect.numbers = sequences.mersennePrime.numbers.map((x) => x * ((x + 1) / 2));
// the last mersenne produces a perfect number larger than default integer size
sequences.perfect.numbers.pop();
function getNextRepDigit(n) {
    const initialDigit = parseInt(n.toString().slice(0, 1));
    const numLength = Math.floor(Math.log(n) / Math.log(10)) + 1;
    const repDigit = parseInt(new Array(numLength).fill(initialDigit).join(""));
    if (repDigit >= n) {
        return repDigit;
    }
    else {
        return parseInt(new Array(numLength).fill(initialDigit + 1).join(""));
    }
}
function getNextXToPower(n, power) {
    return power ** Math.ceil(Math.log(n) / Math.log(power));
}
function getNextBaseToX(n, base) {
    return base ** Math.ceil(n ** (1 / base));
}
function getNextFibonacci(n) {
    if (n === 0) {
        return 0;
    }
    const phi = (1 + 5 ** (1 / 2)) / 2;
    let base = 1 + Math.floor(Math.log(n) / Math.log(phi));
    function binet(n) {
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
function getNextBase10(n) {
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
function getNextLucas(n) {
    const phi = (1 + 5 ** (1 / 2)) / 2;
    let base = Math.round(Math.log(n) / Math.log(phi));
    function luca(n) {
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
$("getDatesButton").addEventListener("click", () => {
    const birthdate = Math.floor(
    // @ts-ignore
    (new Date().valueOf() - new Date($("birthdateInput").value).valueOf()) /
        1000);
    console.log("hi there", birthdate);
    output.textContent = `${(birthdate / timeConsts.marsYear).toFixed(3)} mars years`;
    output.textContent += getNextDates(birthdate);
});
function getNextDates(inputTimestamp) {
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
