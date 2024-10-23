"use strict";
function $(id) {
    return document.getElementById(id);
}
const timeConsts = {
    week: {
        seconds: 604800,
        label: "week",
    },
    day: { seconds: 86400, label: "day" },
    hour: {
        seconds: 3600,
        label: "hour",
    },
    minute: {
        seconds: 60,
        label: "minute",
    },
    second: {
        seconds: 1,
        label: "second",
    },
    sunDay: {
        seconds: 2191832,
        label: "sun day (sidereal)",
    },
    moonYearSyn: {
        seconds: 2551442.9,
        label: "moon year (synodic orbit)",
    },
    moonYearSid: {
        seconds: 2360591.5,
        label: "moon year (sidereal orbit)",
    },
    mercuryDay: {
        seconds: 5067360,
        label: "mercury day (synodic rotation)",
    },
    mercuryYear: {
        seconds: 7600521.6,
        label: "mercury year (sidereal orbit)",
    },
    venusDay: {
        seconds: 242092800,
        label: "venus day (synodic rotation)",
    },
    venusYear: {
        seconds: 19414166.4,
        label: "venus year (sidereal orbit)",
    },
    marsDay: {
        seconds: 88774.92,
        label: "mars day (synodic rotation)",
    },
    marsYear: {
        seconds: 59355072,
        label: "mars year (sidereal orbit)",
    },
    ceresDay: {
        seconds: 3266.4,
        label: "ceres day (synodic rotation)",
    },
    ceresYear: {
        seconds: 145164960,
        label: "ceres year (sidereal orbit)",
    },
    jupiterDay: {
        seconds: 35733.24,
        label: "jupiter day (synodic rotation)",
    },
    jupiterYear: {
        seconds: 374335689.6,
        label: "jupiter year (sidereal orbit)",
    },
    saturnDay: {
        seconds: 38361.6,
        label: "saturn day (synodic rotation)",
    },
    saturnYear: {
        seconds: 929596608,
        label: "saturn year (sidereal orbit)",
    },
    uranusDay: {
        seconds: 1489536,
        label: "uranus day (synodic rotation)",
    },
    uranusYear: {
        seconds: 2651218560,
        label: "uranus year (sidereal orbit)",
    },
    neptuneDay: {
        seconds: 1391904,
        label: "neptune day (synodic rotation)",
    },
    neptuneYear: {
        seconds: 5198601600,
        label: "neptune year (sidereal orbit)",
    },
    plutoDay: {
        seconds: 13243564.8,
        label: "pluto day (synodic rotation)",
    },
    plutoYear: {
        seconds: 7824384000,
        label: "pluto year (sidereal orbit)",
    },
    planck: {
        seconds: 5.391247 * 10 ** -44,
        label: "planck seconds",
    },
    cesium: {
        seconds: 1 / 9192631770,
        label: "cesium",
    },
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
    return power ** Math.ceil(Number((Math.log(n) / Math.log(power)).toFixed(5)));
}
function getNextSquareToDimension(n, dimension) {
    return Math.ceil(n ** (1 / dimension)) ** dimension;
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
function createRow(type, val, date, specialVal, specialDate) {
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
    row.appendChild(numberType);
    row.appendChild(nextVal);
    row.appendChild(nextDate);
    row.appendChild(nextInterestingVal);
    row.appendChild(nextInterestingDate);
    const output = $("output");
    output.appendChild(row);
}
createRow("baba", 1, new Date(2001, 1, 5), 5, new Date());
console.log("the numbers", sequences);
const output = $("output");
$("getDatesButton").addEventListener("click", () => {
    const birthdate = Math.floor(
    // @ts-ignore
    (new Date().valueOf() - new Date($("birthdateInput").value).valueOf()) /
        1000);
    console.log("hi there", birthdate);
    output.textContent = `${(birthdate / timeConsts.marsYear.seconds).toFixed(3)} mars years`;
    getNextDates(birthdate);
});
function getNextDates(inputTimestamp) {
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
