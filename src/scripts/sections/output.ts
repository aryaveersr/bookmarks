import { exportBookmarks, outputGroup } from "../controllers/bookmarkGroups";
import { $ } from "../common";
import { GroupEntry } from "../models/entry";
import { activeGroup, updateGroupTitle } from "../controllers/activeGroup";

const exportBtn = $<HTMLButtonElement>("output-btn-export");
const createBtn = $<HTMLButtonElement>("output-btn-create-group");
const radioBtn = $<HTMLInputElement>("output-radio");
const titleInput = $<HTMLInputElement>("output-input-title");

exportBtn.addEventListener("click", () => exportBookmarks());
createBtn.addEventListener("click", () => {
  const title = prompt("Enter group name:");
  if (!title) return;

  const group = new GroupEntry(title);
  activeGroup!.appendChild(group);
  activeGroup!.children[activeGroup!.children.length - 1]!.onActive();
});

radioBtn.addEventListener("click", () => outputGroup.onActive());
titleInput.addEventListener(
  "keydown",
  (ev) => ev.key == "Enter" && updateGroupTitle(titleInput.value)
);

export function updateOutput() {
  if (activeGroup?.isTopLevel) {
    radioBtn.checked = true;
    titleInput.disabled = true;
    titleInput.value = "";
    return;
  } else {
    radioBtn.checked = false;
  }

  titleInput.value = activeGroup!.title;
  titleInput.disabled = false;
}
