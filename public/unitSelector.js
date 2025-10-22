import { timeConsts } from "./timeConsts.js";
import { capitalize } from "./utils.js";
const initCheckedUnits = ["week", "day", "hour", "minute", "second"];
function createCheckbox(id, label) {
    const labelElement = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.marginRight = "12px";
    checkbox.id = `checkbox${capitalize(id)}`;
    labelElement.append(checkbox, label);
    return labelElement;
}
function createTimeOptions() {
    const drawer = document.getElementById("unitDrawer");
    const allCheckboxContainer = createCheckbox("All", "select all");
    drawer.append(allCheckboxContainer);
    for (const time in timeConsts) {
        const unit = timeConsts[time];
        const checkboxContainer = createCheckbox(time, unit.label);
        const checkbox = checkboxContainer.children[0];
        checkbox.checked = initCheckedUnits.includes(time);
        drawer.append(checkboxContainer);
    }
    allCheckboxContainer.addEventListener("click", () => {
        const allCheckbox = document.getElementById("checkboxAll");
        const isChecked = allCheckbox.checked;
        for (const time in timeConsts) {
            const checkboxI = document.getElementById(`checkbox${capitalize(time)}`);
            checkboxI.checked = isChecked;
        }
    });
}
export function getCheckedUnits() {
    const checkedUnits = {};
    for (const time in timeConsts) {
        const unit = timeConsts[time];
        const checkbox = document.getElementById(`checkbox${capitalize(time)}`);
        if (checkbox.checked) {
            checkedUnits[time] = unit;
        }
    }
    return checkedUnits;
}
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
createTimeOptions();
