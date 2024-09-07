"use strict";

const WEEK_SECONDS = 604_800;
const DAY_SECONDS = 86_400;
const HOUR_SECONDS = 3_600;
const MINUTE_SECONDS = 60;
const SUN_DAY_SECONDS = 2_191_832;

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

$("getDatesButton")!.addEventListener("click", () => {
  console.log("waba");
});
