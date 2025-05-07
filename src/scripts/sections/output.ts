import { $ } from "../common";
import bookmark from "../bookmark";

const exportBtn = $<HTMLButtonElement>("output-btn-export");
const createBtn = $<HTMLButtonElement>("output-btn-create-group");
const radioBtn = $<HTMLInputElement>("output-radio");
const titleInput = $<HTMLInputElement>("output-input-title");

exportBtn.addEventListener("click", () => bookmark.export());
createBtn.addEventListener("click", () => bookmark.createGroup());
radioBtn.addEventListener("click", () => bookmark.setOutputGroupActive());
titleInput.addEventListener("keydown", (ev) => {
  if (ev.key != "Enter") return;

  bookmark.activeGroup.title = titleInput.value;
});

export function updateOutput() {
  if (bookmark.activeGroup.isTopLevel) {
    radioBtn.checked = true;
    titleInput.disabled = true;
    titleInput.value = "";
  } else {
    radioBtn.checked = false;
    titleInput.disabled = false;
    titleInput.value = bookmark.activeGroup.title;
  }
}
