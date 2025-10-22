"use strict";
document
    .getElementById("unitLegend")
    .addEventListener("click", toggleUnitsDrawer);
function toggleUnitsDrawer() {
    const drawer = document.getElementById("unitDrawer");
    const upArrow = document.getElementById("unitUpArrow");
    const downArrow = document.getElementById("unitDownArrow");
    // @ts-ignore if it ain't broke don't fix it
    drawer.value = !drawer.value;
    // @ts-ignore
    if (drawer.value) {
        drawer.classList.remove("hidden");
        downArrow.classList.add("hidden");
        upArrow.classList.remove("hidden");
    }
    else {
        drawer.classList.add("hidden");
        downArrow.classList.remove("hidden");
        upArrow.classList.add("hidden");
    }
}
