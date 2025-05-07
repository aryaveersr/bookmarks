import { $ } from "../common";
import bookmark from "../bookmark";

const fileInput = $<HTMLInputElement>("input-input-file");

fileInput.addEventListener("change", () => {
  if (!fileInput.files || fileInput.files.length == 0) return;

  bookmark.importFrom(fileInput.files[0]!);
});
