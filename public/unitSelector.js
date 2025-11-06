import { timeConsts } from "./timeConsts.js";
import { capitalize } from "./utils.js";
const initCheckedUnits = ["week", "day", "hour", "minute", "second"];
function createCheckbox(key, label) {
    const labelElement = document.createElement("label");
    labelElement.textContent = label;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox${capitalize(key)}`;
    labelElement.htmlFor = checkbox.id;
    return [checkbox, labelElement];
}
function createTimeOptions() {
    const drawer = document.getElementById("unitDrawer");
    const allCheckboxContainer = createCheckbox("all", "select all");
    drawer.append(...allCheckboxContainer);
    timeConsts.forEach((unit) => {
        const checkboxContainer = createCheckbox(unit.key, unit.label);
        const checkbox = checkboxContainer[0];
        checkbox.checked = initCheckedUnits.includes(unit.key);
        drawer.append(...checkboxContainer);
    });
    allCheckboxContainer[0].addEventListener("change", () => {
        const allCheckbox = document.getElementById("checkboxAll");
        const isChecked = allCheckbox.checked;
        timeConsts.forEach((unit) => {
            const checkboxI = document.getElementById(`checkbox${capitalize(unit.key)}`);
            checkboxI.checked = isChecked;
        });
    });
}
export function getCheckedUnits() {
    const checkedUnits = [];
    timeConsts.forEach((unit) => {
        const checkbox = document.getElementById(`checkbox${capitalize(unit.key)}`);
        if (checkbox.checked) {
            checkedUnits.push(unit);
        }
    });
    return checkedUnits;
}
createTimeOptions();
