import { $ } from "../common";
import bookmark from "../bookmark";

const section = document.querySelector("section.section-start") as HTMLElement;
const skipButton = $<HTMLButtonElement>("start-btn-skip");
const fileInput = $<HTMLInputElement>("start-input-file");

skipButton.addEventListener("click", () => {
  section.style.display = "none";
});

fileInput.addEventListener("change", () => {
  if (!fileInput.files || fileInput.files.length == 0) return;

  bookmark.importFrom(fileInput.files[0]!);
  section.style.display = "none";
});
