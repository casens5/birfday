import { timeConsts, TimeConstType } from "./timeConsts.js";
import { capitalize } from "./utils.js";

const initCheckedUnits: string[] = ["week", "day", "hour", "minute", "second"];

function createCheckbox(key: string, label: string) {
  const labelElement = document.createElement("label");
  const checkbox = document.createElement("input") as HTMLInputElement;
  checkbox.type = "checkbox";
  checkbox.style.marginRight = "12px";
  checkbox.id = `checkbox${capitalize(key)}`;
  labelElement.append(checkbox, label);
  return labelElement;
}

function createTimeOptions() {
  const drawer = document.getElementById("unitDrawer")!;
  const allCheckboxContainer = createCheckbox("all", "select all");
  drawer.append(allCheckboxContainer);

  timeConsts.forEach((unit) => {
    const checkboxContainer = createCheckbox(unit.key, unit.label);
    const checkbox = checkboxContainer.children[0] as HTMLInputElement;
    checkbox.checked = initCheckedUnits.includes(unit.key);
    drawer.append(checkboxContainer);
  });

  allCheckboxContainer.addEventListener("click", () => {
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

document
  .getElementById("unitCheckbox")!
  .addEventListener("change", toggleUnitsDrawer);

function toggleUnitsDrawer() {
  const checkbox = document.getElementById("unitCheckbox") as HTMLInputElement;

  const drawer = document.getElementById("unitDrawer")!;
  const upArrow = document.getElementById("unitUpArrow")!;
  const downArrow = document.getElementById("unitDownArrow")!;

  if (checkbox.checked) {
    drawer.classList.remove("hidden");
    downArrow.classList.add("hidden");
    upArrow.classList.remove("hidden");
  } else {
    drawer.classList.add("hidden");
    downArrow.classList.remove("hidden");
    upArrow.classList.add("hidden");
  }
}

createTimeOptions();
