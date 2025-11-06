import { timeConsts, TimeConstType } from "./timeConsts.js";
import { capitalize } from "./utils.js";

const initCheckedUnits: string[] = ["week", "day", "hour", "minute", "second"];

function createCheckbox(key: string, label: string) {
  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  const checkbox = document.createElement("input") as HTMLInputElement;
  checkbox.type = "checkbox";
  checkbox.id = `checkbox${capitalize(key)}`;
  labelElement.htmlFor = checkbox.id;
  return [checkbox, labelElement];
}

function createTimeOptions() {
  const drawer = document.getElementById("unitDrawer")!;
  const allCheckboxContainer = createCheckbox("all", "select all");
  drawer.append(...allCheckboxContainer);

  timeConsts.forEach((unit) => {
    const checkboxContainer = createCheckbox(unit.key, unit.label);
    const checkbox = checkboxContainer[0] as HTMLInputElement;
    checkbox.checked = initCheckedUnits.includes(unit.key);
    drawer.append(...checkboxContainer);
  });

  allCheckboxContainer[0].addEventListener("change", () => {
    const allCheckbox = document.getElementById(
      "checkboxAll",
    ) as HTMLInputElement;
    const isChecked = allCheckbox.checked;
    timeConsts.forEach((unit) => {
      const checkboxI = document.getElementById(
        `checkbox${capitalize(unit.key)}`,
      ) as HTMLInputElement;
      checkboxI.checked = isChecked;
    });
  });
}

export function getCheckedUnits() {
  const checkedUnits: TimeConstType[] = [];
  timeConsts.forEach((unit) => {
    const checkbox = document.getElementById(
      `checkbox${capitalize(unit.key)}`,
    ) as HTMLInputElement;
    if (checkbox.checked) {
      checkedUnits.push(unit);
    }
  });
  return checkedUnits;
}

createTimeOptions();
