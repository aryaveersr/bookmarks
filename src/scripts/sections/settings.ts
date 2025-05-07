import { $ } from "../common";
import keybinds, { keybindToString, type Keybind } from "../keybinds";

const headerBtn = $<HTMLButtonElement>("header-btn-settings");
const section = document.querySelector(".section-settings") as HTMLElement;
const closeBtn = $<HTMLButtonElement>("settings-btn-close");
const keybindContainer = section.querySelector("main")!;
const resetBtn = $<HTMLButtonElement>("settings-btn-reset");

let currentActive: string = "";
let currentAction: Keybind = {
  key: "",
  altKey: false,
  ctrlKey: false,
  shiftKey: false,
};

for (const child of keybindContainer.children) {
  const key = child.getAttribute("data-keybind")!;
  const action = keybinds.keybindsMap[key]!;

  child.children[1]!.innerHTML = keybindToString(action);
  child.children[1]!.addEventListener("click", () => {
    currentActive = key;
    child.children[1]!.innerHTML = "Waiting for keypress....";
  });
}

window.addEventListener("keydown", (ev) => {
  if (!currentActive) return;
  ev.preventDefault();

  if (ev.key == "Control") currentAction.ctrlKey = true;
  else if (ev.key == "Shift") currentAction.shiftKey = true;
  else if (ev.key == "Alt") currentAction.altKey = true;
  else {
    currentAction.key = ev.key;
    keybinds.set(currentActive, currentAction);

    keybindContainer.querySelector(
      `[data-keybind='${currentActive}'] button`
    )!.innerHTML = keybindToString(currentAction);

    currentActive = "";
    currentAction = {
      key: "",
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
    };

    return;
  }

  keybindContainer.querySelector(
    `[data-keybind='${currentActive}'] button`
  )!.innerHTML = keybindToString(currentAction);
});

window.addEventListener("keyup", (ev) => {
  if (!currentActive) return;
  ev.preventDefault();

  if (ev.key == "Control") currentAction.ctrlKey = false;
  else if (ev.key == "Shift") currentAction.shiftKey = false;
  else if (ev.key == "Alt") currentAction.altKey = false;

  keybindContainer.querySelector(
    `[data-keybind='${currentActive}'] button`
  )!.innerHTML = keybindToString(currentAction);
});

headerBtn.addEventListener("click", () => {
  section.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  section.style.display = "none";
});

section.addEventListener("click", (ev) => {
  if (ev.currentTarget == ev.target) {
    section.style.display = "none";
  }
});

resetBtn.addEventListener("click", () => {
  keybinds.reset();
  for (const child of keybindContainer.children) {
    const key = child.getAttribute("data-keybind")!;
    const action = keybinds.keybindsMap[key]!;

    child.children[1]!.innerHTML = keybindToString(action);
  }
});
