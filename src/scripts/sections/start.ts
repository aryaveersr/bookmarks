import { handleFile } from "../controllers/bookmarkGroups";
import { $ } from "../common";

const section = document.querySelector("section.section-start") as HTMLElement;
const skipButton = $<HTMLButtonElement>("start-btn-skip");
const fileInput = $<HTMLInputElement>("start-input-file");

skipButton.addEventListener("click", () => {
  section.style.display = "none";
});

fileInput.addEventListener("change", (ev) => {
  if (handleFile(ev as any)) {
    section.style.display = "none";
  }
});
